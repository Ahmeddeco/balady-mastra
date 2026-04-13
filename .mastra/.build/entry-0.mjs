import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { MastraCompositeStore } from '@mastra/core/storage';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { createTool } from '@mastra/core/tools';
import { ollama } from 'ollama-ai-provider-v2';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as runtime from '@prisma/client/runtime/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { workflowRoute } from '@mastra/ai-sdk';

"use strict";
const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string()
});
function getWeatherCondition$1(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm"
  };
  return conditions[code] || "Unknown";
}
const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetches weather forecast for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for")
  }),
  outputSchema: forecastSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputData.city)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();
    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${inputData.city}' not found`);
    }
    const { latitude, longitude, name } = geocodingData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto,&hourly=precipitation_probability,temperature_2m`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    const forecast = {
      date: (/* @__PURE__ */ new Date()).toISOString(),
      maxTemp: Math.max(...data.hourly.temperature_2m),
      minTemp: Math.min(...data.hourly.temperature_2m),
      condition: getWeatherCondition$1(data.current.weathercode),
      precipitationChance: data.hourly.precipitation_probability.reduce(
        (acc, curr) => Math.max(acc, curr),
        0
      ),
      location: name
    };
    return forecast;
  }
});
const planActivities = createStep({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string()
  }),
  execute: async ({ inputData, mastra }) => {
    const forecast = inputData;
    if (!forecast) {
      throw new Error("Forecast data not found");
    }
    const agent = mastra?.getAgent("weatherAgent");
    if (!agent) {
      throw new Error("Weather agent not found");
    }
    const prompt = `Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
      ${JSON.stringify(forecast, null, 2)}
      For each day in the forecast, structure your response exactly as follows:

      \u{1F4C5} [Day, Month Date, Year]
      \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

      \u{1F321}\uFE0F WEATHER SUMMARY
      \u2022 Conditions: [brief description]
      \u2022 Temperature: [X\xB0C/Y\xB0F to A\xB0C/B\xB0F]
      \u2022 Precipitation: [X% chance]

      \u{1F305} MORNING ACTIVITIES
      Outdoor:
      \u2022 [Activity Name] - [Brief description including specific location/route]
        Best timing: [specific time range]
        Note: [relevant weather consideration]

      \u{1F31E} AFTERNOON ACTIVITIES
      Outdoor:
      \u2022 [Activity Name] - [Brief description including specific location/route]
        Best timing: [specific time range]
        Note: [relevant weather consideration]

      \u{1F3E0} INDOOR ALTERNATIVES
      \u2022 [Activity Name] - [Brief description including specific venue]
        Ideal for: [weather condition that would trigger this alternative]

      \u26A0\uFE0F SPECIAL CONSIDERATIONS
      \u2022 [Any relevant weather warnings, UV index, wind conditions, etc.]

      Guidelines:
      - Suggest 2-3 time-specific outdoor activities per day
      - Include 1-2 indoor backup options
      - For precipitation >50%, lead with indoor activities
      - All activities must be specific to the location
      - Include specific venues, trails, or locations
      - Consider activity intensity based on temperature
      - Keep descriptions concise but informative

      Maintain this exact formatting for consistency, using the emoji and section headers as shown.`;
    const response = await agent.stream([
      {
        role: "user",
        content: prompt
      }
    ]);
    let activitiesText = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }
    return {
      activities: activitiesText
    };
  }
});
const weatherWorkflow = createWorkflow({
  id: "weather-workflow",
  inputSchema: z.object({
    city: z.string().describe("The city to get the weather for")
  }),
  outputSchema: z.object({
    activities: z.string()
  })
}).then(fetchWeather).then(planActivities);
weatherWorkflow.commit();

"use strict";
const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name")
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string()
  }),
  execute: async (inputData) => {
    return await getWeather(inputData.location);
  }
});
const getWeather = async (location) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = await geocodingResponse.json();
  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }
  const { latitude, longitude, name } = geocodingData.results[0];
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;
  const response = await fetch(weatherUrl);
  const data = await response.json();
  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name
  };
};
function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return conditions[code] || "Unknown";
}

"use strict";
const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.
      - If the user asks for activities, respond in the format they request.

      Use the weatherTool to fetch current weather data.
`,
  model: ollama("llama3.1"),
  tools: { weatherTool },
  memory: new Memory()
});

"use strict";
const config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator zod {\n  provider                         = "zod-prisma-types"\n  output                           = "../src/generated"\n  useMultipleFiles                 = true\n  writeNullishInModelTypes         = true\n  createModelTypes                 = true\n  // default is true\n  writeBarrelFiles                 = false\n  // default is true\n  createInputTypes                 = false\n  // default is true\n  addInputTypeValidation           = false\n  // default is true\n  addIncludeType                   = false\n  // default is true\n  addSelectType                    = false\n  // default is true\n  validateWhereUniqueInput         = false\n  // default is true\n  createOptionalDefaultValuesTypes = false\n  // default is false\n  createRelationValuesTypes        = false\n  // default is false\n  createPartialTypes               = false\n  // default is false\n  useDefaultValidators             = false\n  // default is true\n  coerceDate                       = false\n  // default is true\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n  // output   = "./src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Account {\n  userId            String\n  type              String\n  provider          String\n  providerAccountId String\n  refresh_token     String?\n  access_token      String?\n  expires_at        Int?\n  token_type        String?\n  scope             String?\n  id_token          String?\n  session_state     String?\n  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt         DateTime @default(now())\n  updatedAt         DateTime @updatedAt\n\n  @@id([provider, providerAccountId])\n}\n\nmodel Session {\n  id           String   @id @default(cuid())\n  sessionToken String   @unique // <--- THIS IS THE CRITICAL LINE\n  userId       String\n  expires      DateTime\n  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n}\n\nmodel VerificationToken {\n  identifier String\n  token      String\n  expires    DateTime\n\n  @@id([identifier, token])\n}\n\nmodel Authenticator {\n  credentialID         String  @unique\n  userId               String\n  providerAccountId    String\n  credentialPublicKey  String\n  counter              Int\n  credentialDeviceType String\n  credentialBackedUp   Boolean\n  transports           String?\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@id([userId, credentialID])\n}\n\nmodel User {\n  id              String          @id @default(cuid())\n  name            String?\n  email           String          @unique\n  emailVerified   DateTime?\n  image           String?\n  role            Role            @default(USER)\n  accounts        Account[]\n  sessions        Session[]\n  Authenticator   Authenticator[]\n  personalId      String?\n  primaryMobile   String?         @unique\n  secondaryMobile String?\n  country         String?\n  state           String?\n  city            String?\n  detailedAddress String?\n  orders          Order[]\n  favorites       Favorite[]\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n}\n\nmodel Product {\n  id            String      @id @default(cuid())\n  // \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0644\u062A\u0645\u0643\u064A\u0646 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0645\u0646 \u0627\u0644\u0641\u0644\u062A\u0631\u0629 \u0628\u062F\u0642\u0629\n  type          String? // \u0645\u062B\u0627\u0644: \u0628\u0642\u0631\u064A\u060C \u0636\u0623\u0646 [\u062A\u0637\u0627\u0628\u0642 meatType \u0641\u064A \u0627\u0644\u0628\u0648\u062A]\n  cut           String? // \u0645\u062B\u0627\u0644: \u0645\u0648\u0632\u0629\u060C \u0631\u064A\u0634 [\u062A\u0637\u0627\u0628\u0642 cutName \u0641\u064A \u0627\u0644\u0628\u0648\u062A]\n  preparation   String? // \u0645\u062B\u0627\u0644: \u0645\u0641\u0631\u0648\u0645\u060C \u0645\u0643\u0639\u0628\u0627\u062A [\u062A\u0637\u0627\u0628\u0642 preparation \u0641\u064A \u0627\u0644\u0628\u0648\u062A]\n  title         String      @unique\n  slug          String      @unique // \u0631\u0648\u0627\u0628\u0637 \u0635\u062F\u064A\u0642\u0629 \u0644\u0645\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0628\u062D\u062B\n  description   String\n  increaseByOne Boolean     @default(true)\n  specialCut    Boolean?    @default(false)\n  category      Category\n  mainImage     String\n  images        String[]\n  price         Int         @default(0)\n  discount      Int?        @default(0)\n  unit          Unit?       @default(KG)\n  quantity      Int         @default(0)\n  lowQuantity   Int?        @default(0)\n  orderItems    OrderItem[]\n  createdAt     DateTime    @default(now())\n  updatedAt     DateTime    @updatedAt\n  favorites     Favorite[]\n  isActive      Boolean?    @default(false) // \u0644\u0625\u062E\u0641\u0627\u0621 \u0645\u0646\u062A\u062C \u0645\u0624\u0642\u062A\u0627\u064B \u062F\u0648\u0646 \u062D\u0630\u0641\u0647.\n}\n\nmodel Order {\n  id            String        @id @default(cuid())\n  orderNumber   Int           @unique @default(autoincrement()) // \u0627\u0644\u0639\u0645\u064A\u0644 \u064A\u062D\u0628 \u0627\u0644\u062A\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0627\u0631\u0642\u0627\u0645 \u0627\u0644\u0639\u0627\u062F\u064A\u0629\u060C \u0648\u0627\u064A\u0636\u0627 \u0644\u062A\u062D\u0633\u064A\u0646 \u0645\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0628\u062D\u062B.\n  total         Int\n  status        OrderStatus   @default(PENDING)\n  paymentMethod PaymentMethod @default(VISA)\n  paymentStatus PaymentStatus @default(PENDING)\n  items         OrderItem[]\n  orderStatus   OrderStatus   @default(PENDING)\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  user          User?         @relation(fields: [userId], references: [id])\n  userId        String?\n}\n\nmodel OrderItem {\n  id        String  @id @default(cuid())\n  quantity  Int\n  // \u0646\u0635\u064A\u062D\u0629 \u0623\u0645\u0646\u064A\u0629: \u0644\u0627\u062A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0633\u0639\u0631 \u0627\u0644\u0646\u062A\u062C \u0627\u0644\u062D\u0627\u0644\u064A \u0641\u064A \u062C\u062F\u0648\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0639\u0646\u062F \u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0642\u062F\u064A\u0645\u0629\n  // \u0644\u0623\u0646\u0643 \u0644\u0648 \u063A\u064A\u0631\u062A \u0627\u0644\u0633\u0639\u0631 \u063A\u062F\u0627 \u0633\u062A\u062A\u063A\u064A\u0631 \u0642\u064A\u0645\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u0645\u062A \u0633\u0627\u0628\u0642\u0627\u060C \u064A\u062C\u0628 \u062A\u062E\u0632\u064A\u0646 \u0627\u0644\u0633\u0639\u0631 \u0648\u0642\u062A \u0627\u0644\u0634\u0631\u0627\u0621.\n  price     Int // \u062A\u0645 \u0627\u0636\u0627\u0641\u0629 \u062D\u0642\u0644 \u0627\u0644\u0633\u0639\u0631 \u0647\u0646\u0627 \u0644\u064A\u0643\u0648\u0646 \u0645\u062D\u062F\u062B \u0644\u0622\u062E\u0631 \u0633\u0639\u0631 \u0644\u0644\u0645\u0646\u062A\u062C\u060C \n  order     Order   @relation(fields: [orderId], references: [id])\n  orderId   String\n  product   Product @relation(fields: [productId], references: [id])\n  productId String\n}\n\n// \u064A\u0641\u0636\u0644 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 "Explicit Many-to-Many" (\u062C\u062F\u0648\u0644 \u0648\u0633\u064A\u0637 \u0635\u0631\u064A\u062D).\n// \u0644\u0645\u0627\u0630\u0627\u061F \u0644\u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u0645\u0639\u0631\u0641\u0629 "\u0645\u062A\u0649" \u0642\u0627\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0644\u0644\u0645\u0641\u0636\u0644\u0629\u060C \u0648\u0644\u0636\u0645\u0627\u0646 \u0623\u062F\u0627\u0621 \u0623\u0641\u0636\u0644 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0639\u0644\u0627\u0645.\nmodel Favorite {\n  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade) // \u0625\u0630\u0627 \u062D\u064F\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u060C \u062A\u064F\u062D\u0630\u0641 \u0639\u0646\u0627\u0635\u0631\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B\n  productId String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade) // \u0625\u0630\u0627 \u062D\u064F\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u060C \u062A\u064F\u062D\u0630\u0641 \u0639\u0646\u0627\u0635\u0631\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B\n  userId    String\n  createdAt DateTime @default(now())\n\n  @@id([userId, productId]) // \u0645\u0646\u0639 \u062A\u0643\u0631\u0627\u0631 \u0646\u0641\u0633 \u0627\u0644\u0645\u0646\u062A\u062C \u0644\u0646\u0641\u0633 \u0627\u0644\u0639\u0645\u064A\u0644\n}\n\nenum Role {\n  ADMIN\n  USER\n  CLIENT\n  SUPPLIER\n}\n\nenum Category {\n  MEAT\n  PROCESSED\n  CHICKEN\n}\n\nenum Unit {\n  KG\n  PIECE\n}\n\nenum OrderStatus {\n  PENDING\n  SHIPPED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  VISA\n  CASH\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Account":{"fields":[{"name":"userId","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"provider","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"refresh_token","kind":"scalar","type":"String"},{"name":"access_token","kind":"scalar","type":"String"},{"name":"expires_at","kind":"scalar","type":"Int"},{"name":"token_type","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"id_token","kind":"scalar","type":"String"},{"name":"session_state","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sessionToken","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"expires","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"VerificationToken":{"fields":[{"name":"identifier","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expires","kind":"scalar","type":"DateTime"}],"dbName":null},"Authenticator":{"fields":[{"name":"credentialID","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerAccountId","kind":"scalar","type":"String"},{"name":"credentialPublicKey","kind":"scalar","type":"String"},{"name":"counter","kind":"scalar","type":"Int"},{"name":"credentialDeviceType","kind":"scalar","type":"String"},{"name":"credentialBackedUp","kind":"scalar","type":"Boolean"},{"name":"transports","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AuthenticatorToUser"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"Authenticator","kind":"object","type":"Authenticator","relationName":"AuthenticatorToUser"},{"name":"personalId","kind":"scalar","type":"String"},{"name":"primaryMobile","kind":"scalar","type":"String"},{"name":"secondaryMobile","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"detailedAddress","kind":"scalar","type":"String"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"cut","kind":"scalar","type":"String"},{"name":"preparation","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"increaseByOne","kind":"scalar","type":"Boolean"},{"name":"specialCut","kind":"scalar","type":"Boolean"},{"name":"category","kind":"enum","type":"Category"},{"name":"mainImage","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"discount","kind":"scalar","type":"Int"},{"name":"unit","kind":"enum","type":"Unit"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"lowQuantity","kind":"scalar","type":"Int"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"favorites","kind":"object","type":"Favorite","relationName":"FavoriteToProduct"},{"name":"isActive","kind":"scalar","type":"Boolean"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"Int"},{"name":"total","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"orderStatus","kind":"enum","type":"OrderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"userId","kind":"scalar","type":"String"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"productId","kind":"scalar","type":"String"}],"dbName":null},"Favorite":{"fields":[{"name":"product","kind":"object","type":"Product","relationName":"FavoriteToProduct"},{"name":"productId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"FavoriteToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","accounts","user","sessions","Authenticator","order","orderItems","product","favorites","_count","items","orders","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","data","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","create","update","Account.upsertOne","Account.deleteOne","Account.deleteMany","having","_avg","_sum","_min","_max","Account.groupBy","Account.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","VerificationToken.findUnique","VerificationToken.findUniqueOrThrow","VerificationToken.findFirst","VerificationToken.findFirstOrThrow","VerificationToken.findMany","VerificationToken.createOne","VerificationToken.createMany","VerificationToken.createManyAndReturn","VerificationToken.updateOne","VerificationToken.updateMany","VerificationToken.updateManyAndReturn","VerificationToken.upsertOne","VerificationToken.deleteOne","VerificationToken.deleteMany","VerificationToken.groupBy","VerificationToken.aggregate","Authenticator.findUnique","Authenticator.findUniqueOrThrow","Authenticator.findFirst","Authenticator.findFirstOrThrow","Authenticator.findMany","Authenticator.createOne","Authenticator.createMany","Authenticator.createManyAndReturn","Authenticator.updateOne","Authenticator.updateMany","Authenticator.updateManyAndReturn","Authenticator.upsertOne","Authenticator.deleteOne","Authenticator.deleteMany","Authenticator.groupBy","Authenticator.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Favorite.findUnique","Favorite.findUniqueOrThrow","Favorite.findFirst","Favorite.findFirstOrThrow","Favorite.findMany","Favorite.createOne","Favorite.createMany","Favorite.createManyAndReturn","Favorite.updateOne","Favorite.updateMany","Favorite.updateManyAndReturn","Favorite.upsertOne","Favorite.deleteOne","Favorite.deleteMany","Favorite.groupBy","Favorite.aggregate","AND","OR","NOT","productId","userId","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","id","quantity","price","orderId","orderNumber","total","OrderStatus","status","PaymentMethod","paymentMethod","PaymentStatus","paymentStatus","orderStatus","updatedAt","type","cut","preparation","title","slug","description","increaseByOne","specialCut","Category","category","mainImage","images","discount","Unit","unit","lowQuantity","isActive","has","hasEvery","hasSome","every","some","none","name","email","emailVerified","image","Role","role","personalId","primaryMobile","secondaryMobile","country","state","city","detailedAddress","credentialID","providerAccountId","credentialPublicKey","counter","credentialDeviceType","credentialBackedUp","transports","identifier","token","expires","identifier_token","sessionToken","provider","refresh_token","access_token","expires_at","token_type","scope","id_token","session_state","userId_productId","userId_credentialID","provider_providerAccountId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "uARWkAESBAAAwwIAIKYBAADOAgAwpwEAAAMAEKgBAADOAgAwqgEBAKECACGrAUAAqQIAIcQBQACpAgAhxQEBAKECACHqAQEAoQIAIfUBAQChAgAh9gEBAKICACH3AQEAogIAIfgBAgCnAgAh-QEBAKICACH6AQEAogIAIfsBAQCiAgAh_AEBAKICACH_AQAAzwIAIAEAAAABACARBAAAwwIAIKYBAADOAgAwpwEAAAMAEKgBAADOAgAwqgEBAKECACGrAUAAqQIAIcQBQACpAgAhxQEBAKECACHqAQEAoQIAIfUBAQChAgAh9gEBAKICACH3AQEAogIAIfgBAgCnAgAh-QEBAKICACH6AQEAogIAIfsBAQCiAgAh_AEBAKICACEIBAAAhwQAIPYBAADjAgAg9wEAAOMCACD4AQAA4wIAIPkBAADjAgAg-gEAAOMCACD7AQAA4wIAIPwBAADjAgAgAwAAAAMAIAEAAAQAMAIAAAEAIAoEAADDAgAgpgEAAM0CADCnAQAABgAQqAEAAM0CADCqAQEAoQIAIasBQACpAgAhtwEBAKECACHEAUAAqQIAIfIBQACpAgAh9AEBAKECACEBBAAAhwQAIAoEAADDAgAgpgEAAM0CADCnAQAABgAQqAEAAM0CADCqAQEAoQIAIasBQACpAgAhtwEBAAAAAcQBQACpAgAh8gFAAKkCACH0AQEAAAABAwAAAAYAIAEAAAcAMAIAAAgAIAwEAADDAgAgpgEAAMwCADCnAQAACgAQqAEAAMwCADCqAQEAoQIAIekBAQChAgAh6gEBAKECACHrAQEAoQIAIewBAgCmAgAh7QEBAKECACHuASAAowIAIe8BAQCiAgAhAgQAAIcEACDvAQAA4wIAIA0EAADDAgAgpgEAAMwCADCnAQAACgAQqAEAAMwCADCqAQEAoQIAIekBAQAAAAHqAQEAoQIAIesBAQChAgAh7AECAKYCACHtAQEAoQIAIe4BIACjAgAh7wEBAKICACH-AQAAywIAIAMAAAAKACABAAALADACAAAMACAPBAAAygIAIAwAAKoCACCmAQAAxgIAMKcBAAAOABCoAQAAxgIAMKoBAQCiAgAhqwFAAKkCACG3AQEAoQIAIbsBAgCmAgAhvAECAKYCACG-AQAAxwK-ASLAAQAAyALAASLCAQAAyQLCASLDAQAAxwK-ASLEAUAAqQIAIQMEAACHBAAgDAAAogMAIKoBAADjAgAgDwQAAMoCACAMAACqAgAgpgEAAMYCADCnAQAADgAQqAEAAMYCADCqAQEAogIAIasBQACpAgAhtwEBAAAAAbsBAgAAAAG8AQIApgIAIb4BAADHAr4BIsABAADIAsABIsIBAADJAsIBIsMBAADHAr4BIsQBQACpAgAhAwAAAA4AIAEAAA8AMAIAABAAIAoHAADFAgAgCQAAwgIAIKYBAADEAgAwpwEAABIAEKgBAADEAgAwqQEBAKECACG3AQEAoQIAIbgBAgCmAgAhuQECAKYCACG6AQEAoQIAIQIHAACIBAAgCQAAhgQAIAoHAADFAgAgCQAAwgIAIKYBAADEAgAwpwEAABIAEKgBAADEAgAwqQEBAKECACG3AQEAAAABuAECAKYCACG5AQIApgIAIboBAQChAgAhAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACAIBAAAwwIAIAkAAMICACCmAQAAwQIAMKcBAAAXABCoAQAAwQIAMKkBAQChAgAhqgEBAKECACGrAUAAqQIAIQIEAACHBAAgCQAAhgQAIAkEAADDAgAgCQAAwgIAIKYBAADBAgAwpwEAABcAEKgBAADBAgAwqQEBAKECACGqAQEAoQIAIasBQACpAgAh_QEAAMACACADAAAAFwAgAQAAGAAwAgAAGQAgAQAAABIAIAEAAAAXACAXAwAAtgIAIAUAALcCACAGAAC4AgAgCgAAqwIAIA0AALkCACCmAQAAswIAMKcBAAAdABCoAQAAswIAMKsBQACpAgAhtwEBAKECACHEAUAAqQIAIdwBAQCiAgAh3QEBAKECACHeAUAAtAIAId8BAQCiAgAh4QEAALUC4QEi4gEBAKICACHjAQEAogIAIeQBAQCiAgAh5QEBAKICACHmAQEAogIAIecBAQCiAgAh6AEBAKICACEBAAAAHQAgAQAAABIAIAMAAAAXACABAAAYADACAAAZACABAAAAAwAgAQAAAAYAIAEAAAAKACABAAAADgAgAQAAABcAIAEAAAABACADAAAAAwAgAQAABAAwAgAAAQAgAwAAAAMAIAEAAAQAMAIAAAEAIAMAAAADACABAAAEADACAAABACAOBAAAhQQAIKoBAQAAAAGrAUAAAAABxAFAAAAAAcUBAQAAAAHqAQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AECAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAEBEwAAKgAgDaoBAQAAAAGrAUAAAAABxAFAAAAAAcUBAQAAAAHqAQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AECAAAAAfkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAEBEwAALAAwARMAACwAMA4EAACEBAAgqgEBANQCACGrAUAA0wIAIcQBQADTAgAhxQEBANQCACHqAQEA1AIAIfUBAQDUAgAh9gEBAOwCACH3AQEA7AIAIfgBAgCGAwAh-QEBAOwCACH6AQEA7AIAIfsBAQDsAgAh_AEBAOwCACECAAAAAQAgEwAALwAgDaoBAQDUAgAhqwFAANMCACHEAUAA0wIAIcUBAQDUAgAh6gEBANQCACH1AQEA1AIAIfYBAQDsAgAh9wEBAOwCACH4AQIAhgMAIfkBAQDsAgAh-gEBAOwCACH7AQEA7AIAIfwBAQDsAgAhAgAAAAMAIBMAADEAIAIAAAADACATAAAxACADAAAAAQAgGgAAKgAgGwAALwAgAQAAAAEAIAEAAAADACAMCwAA_wMAICAAAIAEACAhAACDBAAgIgAAggQAICMAAIEEACD2AQAA4wIAIPcBAADjAgAg-AEAAOMCACD5AQAA4wIAIPoBAADjAgAg-wEAAOMCACD8AQAA4wIAIBCmAQAAvwIAMKcBAAA4ABCoAQAAvwIAMKoBAQD2AQAhqwFAAPcBACHEAUAA9wEAIcUBAQD2AQAh6gEBAPYBACH1AQEA9gEAIfYBAQCFAgAh9wEBAIUCACH4AQIAlAIAIfkBAQCFAgAh-gEBAIUCACH7AQEAhQIAIfwBAQCFAgAhAwAAAAMAIAEAADcAMB8AADgAIAMAAAADACABAAAEADACAAABACABAAAACAAgAQAAAAgAIAMAAAAGACABAAAHADACAAAIACADAAAABgAgAQAABwAwAgAACAAgAwAAAAYAIAEAAAcAMAIAAAgAIAcEAAD-AwAgqgEBAAAAAasBQAAAAAG3AQEAAAABxAFAAAAAAfIBQAAAAAH0AQEAAAABARMAAEAAIAaqAQEAAAABqwFAAAAAAbcBAQAAAAHEAUAAAAAB8gFAAAAAAfQBAQAAAAEBEwAAQgAwARMAAEIAMAcEAAD9AwAgqgEBANQCACGrAUAA0wIAIbcBAQDUAgAhxAFAANMCACHyAUAA0wIAIfQBAQDUAgAhAgAAAAgAIBMAAEUAIAaqAQEA1AIAIasBQADTAgAhtwEBANQCACHEAUAA0wIAIfIBQADTAgAh9AEBANQCACECAAAABgAgEwAARwAgAgAAAAYAIBMAAEcAIAMAAAAIACAaAABAACAbAABFACABAAAACAAgAQAAAAYAIAMLAAD6AwAgIgAA_AMAICMAAPsDACAJpgEAAL4CADCnAQAATgAQqAEAAL4CADCqAQEA9gEAIasBQAD3AQAhtwEBAPYBACHEAUAA9wEAIfIBQAD3AQAh9AEBAPYBACEDAAAABgAgAQAATQAwHwAATgAgAwAAAAYAIAEAAAcAMAIAAAgAIAemAQAAvAIAMKcBAABUABCoAQAAvAIAMPABAQChAgAh8QEBAKECACHyAUAAqQIAIfMBAAC9AgAgAQAAAFEAIAEAAABRACAGpgEAALwCADCnAQAAVAAQqAEAALwCADDwAQEAoQIAIfEBAQChAgAh8gFAAKkCACEAAwAAAFQAIAEAAFUAMAIAAFEAIAMAAABUACABAABVADACAABRACADAAAAVAAgAQAAVQAwAgAAUQAgA_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_gIAICEAAIEDACAiAACAAwAgIwAA_wIAIMUBAADjAgAgxgEAAOMCACDHAQAA4wIAIMwBAADjAgAg0QEAAOMCACDTAQAA4wIAINQBAADjAgAg1QEAAOMCACAXpgEAAI8CADCnAQAArgEAEKgBAACPAgAwqwFAAPcBACG3AQEA9gEAIbgBAgD-AQAhuQECAP4BACHEAUAA9wEAIcUBAQCFAgAhxgEBAIUCACHHAQEAhQIAIcgBAQD2AQAhyQEBAPYBACHKAQEA9gEAIcsBIACQAgAhzAEgAJECACHOAQAAkgLOASLPAQEA9gEAIdABAACTAgAg0QECAJQCACHTAQAAlQLTASPUAQIAlAIAIdUBIACRAgAhAwAAAJsBACABAACtAQAwHwAArgEAIAMAAACbAQAgAQAAnAEAMAIAAJgBACABAAAAEAAgAQAAABAAIAMAAAAOACABAAAPADACAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAwEAAD8AgAgDAAA-wIAIKoBAQAAAAGrAUAAAAABtwEBAAAAAbsBAgAAAAG8AQIAAAABvgEAAAC-AQLAAQAAAMABAsIBAAAAwgECwwEAAAC-AQLEAUAAAAABARMAALYBACAKqgEBAAAAAasBQAAAAAG3AQEAAAABuwECAAAAAbwBAgAAAAG-AQAAAL4BAsABAAAAwAECwgEAAADCAQLDAQAAAL4BAsQBQAAAAAEBEwAAuAEAMAETAAC4AQAwAQAAAB0AIAwEAADuAgAgDAAA7QIAIKoBAQDsAgAhqwFAANMCACG3AQEA1AIAIbsBAgDeAgAhvAECAN4CACG-AQAA6QK-ASLAAQAA6gLAASLCAQAA6wLCASLDAQAA6QK-ASLEAUAA0wIAIQIAAAAQACATAAC8AQAgCqoBAQDsAgAhqwFAANMCACG3AQEA1AIAIbsBAgDeAgAhvAECAN4CACG-AQAA6QK-ASLAAQAA6gLAASLCAQAA6wLCASLDAQAA6QK-ASLEAUAA0wIAIQIAAAAOACATAAC-AQAgAgAAAA4AIBMAAL4BACABAAAAHQAgAwAAABAAIBoAALYBACAbAAC8AQAgAQAAABAAIAEAAAAOACAGCwAA5AIAICAAAOUCACAhAADoAgAgIgAA5wIAICMAAOYCACCqAQAA4wIAIA2mAQAAgQIAMKcBAADGAQAQqAEAAIECADCqAQEAhQIAIasBQAD3AQAhtwEBAPYBACG7AQIA_gEAIbwBAgD-AQAhvgEAAIICvgEiwAEAAIMCwAEiwgEAAIQCwgEiwwEAAIICvgEixAFAAPcBACEDAAAADgAgAQAAxQEAMB8AAMYBACADAAAADgAgAQAADwAwAgAAEAAgAQAAABQAIAEAAAAUACADAAAAEgAgAQAAEwAwAgAAFAAgAwAAABIAIAEAABMAMAIAABQAIAMAAAASACABAAATADACAAAUACAHBwAA4QIAIAkAAOICACCpAQEAAAABtwEBAAAAAbgBAgAAAAG5AQIAAAABugEBAAAAAQETAADOAQAgBakBAQAAAAG3AQEAAAABuAECAAAAAbkBAgAAAAG6AQEAAAABARMAANABADABEwAA0AEAMAcHAADfAgAgCQAA4AIAIKkBAQDUAgAhtwEBANQCACG4AQIA3gIAIbkBAgDeAgAhugEBANQCACECAAAAFAAgEwAA0wEAIAWpAQEA1AIAIbcBAQDUAgAhuAECAN4CACG5AQIA3gIAIboBAQDUAgAhAgAAABIAIBMAANUBACACAAAAEgAgEwAA1QEAIAMAAAAUACAaAADOAQAgGwAA0wEAIAEAAAAUACABAAAAEgAgBQsAANkCACAgAADaAgAgIQAA3QIAICIAANwCACAjAADbAgAgCKYBAAD9AQAwpwEAANwBABCoAQAA_QEAMKkBAQD2AQAhtwEBAPYBACG4AQIA_gEAIbkBAgD-AQAhugEBAPYBACEDAAAAEgAgAQAA2wEAMB8AANwBACADAAAAEgAgAQAAEwAwAgAAFAAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACAFBAAA2AIAIAkAANcCACCpAQEAAAABqgEBAAAAAasBQAAAAAEBEwAA5AEAIAOpAQEAAAABqgEBAAAAAasBQAAAAAEBEwAA5gEAMAETAADmAQAwBQQAANYCACAJAADVAgAgqQEBANQCACGqAQEA1AIAIasBQADTAgAhAgAAABkAIBMAAOkBACADqQEBANQCACGqAQEA1AIAIasBQADTAgAhAgAAABcAIBMAAOsBACACAAAAFwAgEwAA6wEAIAMAAAAZACAaAADkAQAgGwAA6QEAIAEAAAAZACABAAAAFwAgAwsAANACACAiAADSAgAgIwAA0QIAIAamAQAA9QEAMKcBAADyAQAQqAEAAPUBADCpAQEA9gEAIaoBAQD2AQAhqwFAAPcBACEDAAAAFwAgAQAA8QEAMB8AAPIBACADAAAAFwAgAQAAGAAwAgAAGQAgBqYBAAD1AQAwpwEAAPIBABCoAQAA9QEAMKkBAQD2AQAhqgEBAPYBACGrAUAA9wEAIQ4LAAD5AQAgIgAA_AEAICMAAPwBACCsAQEAAAABrQEBAAAABK4BAQAAAASvAQEAAAABsAEBAAAAAbEBAQAAAAGyAQEAAAABswEBAPsBACG0AQEAAAABtQEBAAAAAbYBAQAAAAELCwAA-QEAICIAAPoBACAjAAD6AQAgrAFAAAAAAa0BQAAAAASuAUAAAAAErwFAAAAAAbABQAAAAAGxAUAAAAABsgFAAAAAAbMBQAD4AQAhCwsAAPkBACAiAAD6AQAgIwAA-gEAIKwBQAAAAAGtAUAAAAAErgFAAAAABK8BQAAAAAGwAUAAAAABsQFAAAAAAbIBQAAAAAGzAUAA-AEAIQisAQIAAAABrQECAAAABK4BAgAAAASvAQIAAAABsAECAAAAAbEBAgAAAAGyAQIAAAABswECAPkBACEIrAFAAAAAAa0BQAAAAASuAUAAAAAErwFAAAAAAbABQAAAAAGxAUAAAAABsgFAAAAAAbMBQAD6AQAhDgsAAPkBACAiAAD8AQAgIwAA_AEAIKwBAQAAAAGtAQEAAAAErgEBAAAABK8BAQAAAAGwAQEAAAABsQEBAAAAAbIBAQAAAAGzAQEA-wEAIbQBAQAAAAG1AQEAAAABtgEBAAAAAQusAQEAAAABrQEBAAAABK4BAQAAAASvAQEAAAABsAEBAAAAAbEBAQAAAAGyAQEAAAABswEBAPwBACG0AQEAAAABtQEBAAAAAbYBAQAAAAEIpgEAAP0BADCnAQAA3AEAEKgBAAD9AQAwqQEBAPYBACG3AQEA9gEAIbgBAgD-AQAhuQECAP4BACG6AQEA9gEAIQ0LAAD5AQAgIAAAgAIAICEAAPkBACAiAAD5AQAgIwAA-QEAIKwBAgAAAAGtAQIAAAAErgECAAAABK8BAgAAAAGwAQIAAAABsQECAAAAAbIBAgAAAAGzAQIA_wEAIQ0LAAD5AQAgIAAAgAIAICEAAPkBACAiAAD5AQAgIwAA-QEAIKwBAgAAAAGtAQIAAAAErgECAAAABK8BAgAAAAGwAQIAAAABsQECAAAAAbIBAgAAAAGzAQIA_wEAIQisAQgAAAABrQEIAAAABK4BCAAAAASvAQgAAAABsAEIAAAAAbEBCAAAAAGyAQgAAAABswEIAIACACENpgEAAIECADCnAQAAxgEAEKgBAACBAgAwqgEBAIUCACGrAUAA9wEAIbcBAQD2AQAhuwECAP4BACG8AQIA_gEAIb4BAACCAr4BIsABAACDAsABIsIBAACEAsIBIsMBAACCAr4BIsQBQAD3AQAhBwsAAPkBACAiAACOAgAgIwAAjgIAIKwBAAAAvgECrQEAAAC-AQiuAQAAAL4BCLMBAACNAr4BIgcLAAD5AQAgIgAAjAIAICMAAIwCACCsAQAAAMABAq0BAAAAwAEIrgEAAADAAQizAQAAiwLAASIHCwAA-QEAICIAAIoCACAjAACKAgAgrAEAAADCAQKtAQAAAMIBCK4BAAAAwgEIswEAAIkCwgEiDgsAAIcCACAiAACIAgAgIwAAiAIAIKwBAQAAAAGtAQEAAAAFrgEBAAAABa8BAQAAAAGwAQEAAAABsQEBAAAAAbIBAQAAAAGzAQEAhgIAIbQBAQAAAAG1AQEAAAABtgEBAAAAAQ4LAACHAgAgIgAAiAIAICMAAIgCACCsAQEAAAABrQEBAAAABa4BAQAAAAWvAQEAAAABsAEBAAAAAbEBAQAAAAGyAQEAAAABswEBAIYCACG0AQEAAAABtQEBAAAAAbYBAQAAAAEIrAECAAAAAa0BAgAAAAWuAQIAAAAFrwECAAAAAbABAgAAAAGxAQIAAAABsgECAAAAAbMBAgCHAgAhC6wBAQAAAAGtAQEAAAAFrgEBAAAABa8BAQAAAAGwAQEAAAABsQEBAAAAAbIBAQAAAAGzAQEAiAIAIbQBAQAAAAG1AQEAAAABtgEBAAAAAQcLAAD5AQAgIgAAigIAICMAAIoCACCsAQAAAMIBAq0BAAAAwgEIrgEAAADCAQizAQAAiQLCASIErAEAAADCAQKtAQAAAMIBCK4BAAAAwgEIswEAAIoCwgEiBwsAAPkBACAiAACMAgAgIwAAjAIAIKwBAAAAwAECrQEAAADAAQiuAQAAAMABCLMBAACLAsABIgSsAQAAAMABAq0BAAAAwAEIrgEAAADAAQizAQAAjALAASIHCwAA-QEAICIAAI4CACAjAACOAgAgrAEAAAC-AQKtAQAAAL4BCK4BAAAAvgEIswEAAI0CvgEiBKwBAAAAvgECrQEAAAC-AQiuAQAAAL4BCLMBAACOAr4BIhemAQAAjwIAMKcBAACuAQAQqAEAAI8CADCrAUAA9wEAIbcBAQD2AQAhuAECAP4BACG5AQIA_gEAIcQBQAD3AQAhxQEBAIUCACHGAQEAhQIAIccBAQCFAgAhyAEBAPYBACHJAQEA9gEAIcoBAQD2AQAhywEgAJACACHMASAAkQIAIc4BAACSAs4BIs8BAQD2AQAh0AEAAJMCACDRAQIAlAIAIdMBAACVAtMBI9QBAgCUAgAh1QEgAJECACEFCwAA-QEAICIAAJ8CACAjAACfAgAgrAEgAAAAAbMBIACeAgAhBQsAAIcCACAiAACdAgAgIwAAnQIAIKwBIAAAAAGzASAAnAIAIQcLAAD5AQAgIgAAmwIAICMAAJsCACCsAQAAAM4BAq0BAAAAzgEIrgEAAADOAQizAQAAmgLOASIErAEBAAAABdYBAQAAAAHXAQEAAAAE2AEBAAAABA0LAACHAgAgIAAAmQIAICEAAIcCACAiAACHAgAgIwAAhwIAIKwBAgAAAAGtAQIAAAAFrgECAAAABa8BAgAAAAGwAQIAAAABsQECAAAAAbIBAgAAAAGzAQIAmAIAIQcLAACHAgAgIgAAlwIAICMAAJcCACCsAQAAANMBA60BAAAA0wEJrgEAAADTAQmzAQAAlgLTASMHCwAAhwIAICIAAJcCACAjAACXAgAgrAEAAADTAQOtAQAAANMBCa4BAAAA0wEJswEAAJYC0wEjBKwBAAAA0wEDrQEAAADTAQmuAQAAANMBCbMBAACXAtMBIw0LAACHAgAgIAAAmQIAICEAAIcCACAiAACHAgAgIwAAhwIAIKwBAgAAAAGtAQIAAAAFrgECAAAABa8BAgAAAAGwAQIAAAABsQECAAAAAbIBAgAAAAGzAQIAmAIAIQisAQgAAAABrQEIAAAABa4BCAAAAAWvAQgAAAABsAEIAAAAAbEBCAAAAAGyAQgAAAABswEIAJkCACEHCwAA-QEAICIAAJsCACAjAACbAgAgrAEAAADOAQKtAQAAAM4BCK4BAAAAzgEIswEAAJoCzgEiBKwBAAAAzgECrQEAAADOAQiuAQAAAM4BCLMBAACbAs4BIgULAACHAgAgIgAAnQIAICMAAJ0CACCsASAAAAABswEgAJwCACECrAEgAAAAAbMBIACdAgAhBQsAAPkBACAiAACfAgAgIwAAnwIAIKwBIAAAAAGzASAAngIAIQKsASAAAAABswEgAJ8CACEZCAAAqgIAIAoAAKsCACCmAQAAoAIAMKcBAACbAQAQqAEAAKACADCrAUAAqQIAIbcBAQChAgAhuAECAKYCACG5AQIApgIAIcQBQACpAgAhxQEBAKICACHGAQEAogIAIccBAQCiAgAhyAEBAKECACHJAQEAoQIAIcoBAQChAgAhywEgAKMCACHMASAApAIAIc4BAAClAs4BIs8BAQChAgAh0AEAAJMCACDRAQIApwIAIdMBAACoAtMBI9QBAgCnAgAh1QEgAKQCACELrAEBAAAAAa0BAQAAAASuAQEAAAAErwEBAAAAAbABAQAAAAGxAQEAAAABsgEBAAAAAbMBAQD8AQAhtAEBAAAAAbUBAQAAAAG2AQEAAAABC6wBAQAAAAGtAQEAAAAFrgEBAAAABa8BAQAAAAGwAQEAAAABsQEBAAAAAbIBAQAAAAGzAQEAiAIAIbQBAQAAAAG1AQEAAAABtgEBAAAAAQKsASAAAAABswEgAJ8CACECrAEgAAAAAbMBIACdAgAhBKwBAAAAzgECrQEAAADOAQiuAQAAAM4BCLMBAACbAs4BIgisAQIAAAABrQECAAAABK4BAgAAAASvAQIAAAABsAECAAAAAbEBAgAAAAGyAQIAAAABswECAPkBACEIrAECAAAAAa0BAgAAAAWuAQIAAAAFrwECAAAAAbABAgAAAAGxAQIAAAABsgECAAAAAbMBAgCHAgAhBKwBAAAA0wEDrQEAAADTAQmuAQAAANMBCbMBAACXAtMBIwisAUAAAAABrQFAAAAABK4BQAAAAASvAUAAAAABsAFAAAAAAbEBQAAAAAGyAUAAAAABswFAAPoBACED2QEAABIAINoBAAASACDbAQAAEgAgA9kBAAAXACDaAQAAFwAg2wEAABcAIBKmAQAArAIAMKcBAACVAQAQqAEAAKwCADCrAUAA9wEAIbcBAQD2AQAhxAFAAPcBACHcAQEAhQIAId0BAQD2AQAh3gFAAK0CACHfAQEAhQIAIeEBAACuAuEBIuIBAQCFAgAh4wEBAIUCACHkAQEAhQIAIeUBAQCFAgAh5gEBAIUCACHnAQEAhQIAIegBAQCFAgAhCwsAAIcCACAiAACyAgAgIwAAsgIAIKwBQAAAAAGtAUAAAAAFrgFAAAAABa8BQAAAAAGwAUAAAAABsQFAAAAAAbIBQAAAAAGzAUAAsQIAIQcLAAD5AQAgIgAAsAIAICMAALACACCsAQAAAOEBAq0BAAAA4QEIrgEAAADhAQizAQAArwLhASIHCwAA-QEAICIAALACACAjAACwAgAgrAEAAADhAQKtAQAAAOEBCK4BAAAA4QEIswEAAK8C4QEiBKwBAAAA4QECrQEAAADhAQiuAQAAAOEBCLMBAACwAuEBIgsLAACHAgAgIgAAsgIAICMAALICACCsAUAAAAABrQFAAAAABa4BQAAAAAWvAUAAAAABsAFAAAAAAbEBQAAAAAGyAUAAAAABswFAALECACEIrAFAAAAAAa0BQAAAAAWuAUAAAAAFrwFAAAAAAbABQAAAAAGxAUAAAAABsgFAAAAAAbMBQACyAgAhFwMAALYCACAFAAC3AgAgBgAAuAIAIAoAAKsCACANAAC5AgAgpgEAALMCADCnAQAAHQAQqAEAALMCADCrAUAAqQIAIbcBAQChAgAhxAFAAKkCACHcAQEAogIAId0BAQChAgAh3gFAALQCACHfAQEAogIAIeEBAAC1AuEBIuIBAQCiAgAh4wEBAKICACHkAQEAogIAIeUBAQCiAgAh5gEBAKICACHnAQEAogIAIegBAQCiAgAhCKwBQAAAAAGtAUAAAAAFrgFAAAAABa8BQAAAAAGwAUAAAAABsQFAAAAAAbIBQAAAAAGzAUAAsgIAIQSsAQAAAOEBAq0BAAAA4QEIrgEAAADhAQizAQAAsALhASID2QEAAAMAINoBAAADACDbAQAAAwAgA9kBAAAGACDaAQAABgAg2wEAAAYAIAPZAQAACgAg2gEAAAoAINsBAAAKACAD2QEAAA4AINoBAAAOACDbAQAADgAgC6YBAAC6AgAwpwEAAH0AEKgBAAC6AgAwqgEBAPYBACHpAQEA9gEAIeoBAQD2AQAh6wEBAPYBACHsAQIA_gEAIe0BAQD2AQAh7gEgAJACACHvAQEAhQIAIQamAQAAuwIAMKcBAABnABCoAQAAuwIAMPABAQD2AQAh8QEBAPYBACHyAUAA9wEAIQamAQAAvAIAMKcBAABUABCoAQAAvAIAMPABAQChAgAh8QEBAKECACHyAUAAqQIAIQLwAQEAAAAB8QEBAAAAAQmmAQAAvgIAMKcBAABOABCoAQAAvgIAMKoBAQD2AQAhqwFAAPcBACG3AQEA9gEAIcQBQAD3AQAh8gFAAPcBACH0AQEA9gEAIRCmAQAAvwIAMKcBAAA4ABCoAQAAvwIAMKoBAQD2AQAhqwFAAPcBACHEAUAA9wEAIcUBAQD2AQAh6gEBAPYBACH1AQEA9gEAIfYBAQCFAgAh9wEBAIUCACH4AQIAlAIAIfkBAQCFAgAh-gEBAIUCACH7AQEAhQIAIfwBAQCFAgAhAqkBAQAAAAGqAQEAAAABCAQAAMMCACAJAADCAgAgpgEAAMECADCnAQAAFwAQqAEAAMECADCpAQEAoQIAIaoBAQChAgAhqwFAAKkCACEbCAAAqgIAIAoAAKsCACCmAQAAoAIAMKcBAACbAQAQqAEAAKACADCrAUAAqQIAIbcBAQChAgAhuAECAKYCACG5AQIApgIAIcQBQACpAgAhxQEBAKICACHGAQEAogIAIccBAQCiAgAhyAEBAKECACHJAQEAoQIAIcoBAQChAgAhywEgAKMCACHMASAApAIAIc4BAAClAs4BIs8BAQChAgAh0AEAAJMCACDRAQIApwIAIdMBAACoAtMBI9QBAgCnAgAh1QEgAKQCACGAAgAAmwEAIIECAACbAQAgGQMAALYCACAFAAC3AgAgBgAAuAIAIAoAAKsCACANAAC5AgAgpgEAALMCADCnAQAAHQAQqAEAALMCADCrAUAAqQIAIbcBAQChAgAhxAFAAKkCACHcAQEAogIAId0BAQChAgAh3gFAALQCACHfAQEAogIAIeEBAAC1AuEBIuIBAQCiAgAh4wEBAKICACHkAQEAogIAIeUBAQCiAgAh5gEBAKICACHnAQEAogIAIegBAQCiAgAhgAIAAB0AIIECAAAdACAKBwAAxQIAIAkAAMICACCmAQAAxAIAMKcBAAASABCoAQAAxAIAMKkBAQChAgAhtwEBAKECACG4AQIApgIAIbkBAgCmAgAhugEBAKECACERBAAAygIAIAwAAKoCACCmAQAAxgIAMKcBAAAOABCoAQAAxgIAMKoBAQCiAgAhqwFAAKkCACG3AQEAoQIAIbsBAgCmAgAhvAECAKYCACG-AQAAxwK-ASLAAQAAyALAASLCAQAAyQLCASLDAQAAxwK-ASLEAUAAqQIAIYACAAAOACCBAgAADgAgDwQAAMoCACAMAACqAgAgpgEAAMYCADCnAQAADgAQqAEAAMYCADCqAQEAogIAIasBQACpAgAhtwEBAKECACG7AQIApgIAIbwBAgCmAgAhvgEAAMcCvgEiwAEAAMgCwAEiwgEAAMkCwgEiwwEAAMcCvgEixAFAAKkCACEErAEAAAC-AQKtAQAAAL4BCK4BAAAAvgEIswEAAI4CvgEiBKwBAAAAwAECrQEAAADAAQiuAQAAAMABCLMBAACMAsABIgSsAQAAAMIBAq0BAAAAwgEIrgEAAADCAQizAQAAigLCASIZAwAAtgIAIAUAALcCACAGAAC4AgAgCgAAqwIAIA0AALkCACCmAQAAswIAMKcBAAAdABCoAQAAswIAMKsBQACpAgAhtwEBAKECACHEAUAAqQIAIdwBAQCiAgAh3QEBAKECACHeAUAAtAIAId8BAQCiAgAh4QEAALUC4QEi4gEBAKICACHjAQEAogIAIeQBAQCiAgAh5QEBAKICACHmAQEAogIAIecBAQCiAgAh6AEBAKICACGAAgAAHQAggQIAAB0AIAKqAQEAAAAB6QEBAAAAAQwEAADDAgAgpgEAAMwCADCnAQAACgAQqAEAAMwCADCqAQEAoQIAIekBAQChAgAh6gEBAKECACHrAQEAoQIAIewBAgCmAgAh7QEBAKECACHuASAAowIAIe8BAQCiAgAhCgQAAMMCACCmAQAAzQIAMKcBAAAGABCoAQAAzQIAMKoBAQChAgAhqwFAAKkCACG3AQEAoQIAIcQBQACpAgAh8gFAAKkCACH0AQEAoQIAIREEAADDAgAgpgEAAM4CADCnAQAAAwAQqAEAAM4CADCqAQEAoQIAIasBQACpAgAhxAFAAKkCACHFAQEAoQIAIeoBAQChAgAh9QEBAKECACH2AQEAogIAIfcBAQCiAgAh-AECAKcCACH5AQEAogIAIfoBAQCiAgAh-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_AwAgEwAAwAMAIA2mAQAAvgMAMKcBAAC_AwAQqAEAAL4DADCqAQEAogIAIasBQACpAgAhtwEBAKECACG7AQIApgIAIbwBAgCmAgAhvgEAAMcCvgEiwAEAAMgCwAEiwgEAAMkCwgEiwwEAAMcCvgEixAFAAKkCACENpgEAAL4DADCnAQAAvwMAEKgBAAC-AwAwqgEBAKICACGrAUAAqQIAIbcBAQChAgAhuwECAKYCACG8AQIApgIAIb4BAADHAr4BIsABAADIAsABIsIBAADJAsIBIsMBAADHAr4BIsQBQACpAgAhCasBQADTAgAhtwEBANQCACG7AQIA3gIAIbwBAgDeAgAhvgEAAOkCvgEiwAEAAOoCwAEiwgEAAOsCwgEiwwEAAOkCvgEixAFAANMCACEKDAAA7QIAIKsBQADTAgAhtwEBANQCACG7AQIA3gIAIbwBAgDeAgAhvgEAAOkCvgEiwAEAAOoCwAEiwgEAAOsCwgEiwwEAAOkCvgEixAFAANMCACEKDAAA-wIAIKsBQAAAAAG3AQEAAAABuwECAAAAAbwBAgAAAAG-AQAAAL4BAsABAAAAwAECwgEAAADCAQLDAQAAAL4BAsQBQAAAAAEH6QEBAAAAAeoBAQAAAAHrAQEAAAAB7AECAAAAAe0BAQAAAAHuASAAAAAB7wEBAAAAAQIAAAAMACAaAADOAwAgAwAAAAwAIBoAAM4DACAbAADNAwAgARMAAJoEADANBAAAwwIAIKYBAADMAgAwpwEAAAoAEKgBAADMAgAwqgEBAKECACHpAQEAAAAB6gEBAKECACHrAQEAoQIAIewBAgCmAgAh7QEBAKECACHuASAAowIAIe8BAQCiAgAh_gEAAMsCACACAAAADAAgEwAAzQMAIAIAAADLAwAgEwAAzAMAIAumAQAAygMAMKcBAADLAwAQqAEAAMoDADCqAQEAoQIAIekBAQChAgAh6gEBAKECACHrAQEAoQIAIewBAgCmAgAh7QEBAKECACHuASAAowIAIe8BAQCiAgAhC6YBAADKAwAwpwEAAMsDABCoAQAAygMAMKoBAQChAgAh6QEBAKECACHqAQEAoQIAIesBAQChAgAh7AECAKYCACHtAQEAoQIAIe4BIACjAgAh7wEBAKICACEH6QEBANQCACHqAQEA1AIAIesBAQDUAgAh7AECAN4CACHtAQEA1AIAIe4BIACCAwAh7wEBAOwCACEH6QEBANQCACHqAQEA1AIAIesBAQDUAgAh7AECAN4CACHtAQEA1AIAIe4BIACCAwAh7wEBAOwCACEH6QEBAAAAAeoBAQAAAAHrAQEAAAAB7AECAAAAAe0BAQAAAAHuASAAAAAB7wEBAAAAAQWrAUAAAAABtwEBAAAAAcQBQAAAAAHyAUAAAAAB9AEBAAAAAQIAAAAIACAaAADaAwAgAwAAAAgAIBoAANoDACAbAADZAwAgARMAAJkEADAKBAAAwwIAIKYBAADNAgAwpwEAAAYAEKgBAADNAgAwqgEBAKECACGrAUAAqQIAIbcBAQAAAAHEAUAAqQIAIfIBQACpAgAh9AEBAAAAAQIAAAAIACATAADZAwAgAgAAANcDACATAADYAwAgCaYBAADWAwAwpwEAANcDABCoAQAA1gMAMKoBAQChAgAhqwFAAKkCACG3AQEAoQIAIcQBQACpAgAh8gFAAKkCACH0AQEAoQIAIQmmAQAA1gMAMKcBAADXAwAQqAEAANYDADCqAQEAoQIAIasBQACpAgAhtwEBAKECACHEAUAAqQIAIfIBQACpAgAh9AEBAKECACEFqwFAANMCACG3AQEA1AIAIcQBQADTAgAh8gFAANMCACH0AQEA1AIAIQWrAUAA0wIAIbcBAQDUAgAhxAFAANMCACHyAUAA0wIAIfQBAQDUAgAhBasBQAAAAAG3AQEAAAABxAFAAAAAAfIBQAAAAAH0AQEAAAABDKsBQAAAAAHEAUAAAAABxQEBAAAAAeoBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQIAAAAB-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAQIAAAABACAaAADmAwAgAwAAAAEAIBoAAOYDACAbAADlAwAgARMAAJgEADASBAAAwwIAIKYBAADOAgAwpwEAAAMAEKgBAADOAgAwqgEBAKECACGrAUAAqQIAIcQBQACpAgAhxQEBAKECACHqAQEAoQIAIfUBAQChAgAh9gEBAKICACH3AQEAogIAIfgBAgCnAgAh-QEBAKICACH6AQEAogIAIfsBAQCiAgAh_AEBAKICACH_AQAAzwIAIAIAAAABACATAADlAwAgAgAAAOMDACATAADkAwAgEKYBAADiAwAwpwEAAOMDABCoAQAA4gMAMKoBAQChAgAhqwFAAKkCACHEAUAAqQIAIcUBAQChAgAh6gEBAKECACH1AQEAoQIAIfYBAQCiAgAh9wEBAKICACH4AQIApwIAIfkBAQCiAgAh-gEBAKICACH7AQEAogIAIfwBAQCiAgAhEKYBAADiAwAwpwEAAOMDABCoAQAA4gMAMKoBAQChAgAhqwFAAKkCACHEAUAAqQIAIcUBAQChAgAh6gEBAKECACH1AQEAoQIAIfYBAQCiAgAh9wEBAKICACH4AQIApwIAIfkBAQCiAgAh-gEBAKICACH7AQEAogIAIfwBAQCiAgAhDKsBQADTAgAhxAFAANMCACHFAQEA1AIAIeoBAQDUAgAh9QEBANQCACH2AQEA7AIAIfcBAQDsAgAh-AECAIYDACH5AQEA7AIAIfoBAQDsAgAh-wEBAOwCACH8AQEA7AIAIQyrAUAA0wIAIcQBQADTAgAhxQEBANQCACHqAQEA1AIAIfUBAQDUAgAh9gEBAOwCACH3AQEA7AIAIfgBAgCGAwAh-QEBAOwCACH6AQEA7AIAIfsBAQDsAgAh_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-AQAA6QK-ASLAAQAA6gLAASLCAQAA6wLCASLDAQAA6QK-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-Xx0_YQxAYh9BYx1CZB1DZQxEaCBFaSRGagRHawRIbARJbQRKbgRLcARMcgxNcyVOdQRPdwxQeCZReQRSegRTewxUfidVfy1WgQECV4IBAliEAQJZhQECWoYBAluIAQJcigEMXYsBLl6NAQJfjwEMYJABL2GRAQJikgECY5MBDGSWATBllwE0ZpkBB2eaAQdonQEHaZ4BB2qfAQdroQEHbKMBDG2kATVupgEHb6gBDHCpATZxqgEHcqsBB3OsAQx0rwE3dbABPXaxAQV3sgEFeLMBBXm0AQV6tQEFe7cBBXy5AQx9ugE-fr0BBX-_AQyAAcABP4EBwgEFggHDAQWDAcQBDIQBxwFAhQHIAUaGAckBBocBygEGiAHLAQaJAcwBBooBzQEGiwHPAQaMAdEBDI0B0gFHjgHUAQaPAdYBDJAB1wFIkQHYAQaSAdkBBpMB2gEMlAHdAUmVAd4BT5YB3wEIlwHgAQiYAeEBCJkB4gEImgHjAQibAeUBCJwB5wEMnQHoAVCeAeoBCJ8B7AEMoAHtAVGhAe4BCKIB7wEIowHwAQykAfMBUqUB9AFW"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import('node:buffer');
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import('@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs'),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import('@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs');
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

"use strict";
const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
const PrismaClientValidationError = runtime.PrismaClientValidationError;
const sql = runtime.sqltag;
const empty = runtime.empty;
const join = runtime.join;
const raw = runtime.raw;
const Sql = runtime.Sql;
const Decimal = runtime.Decimal;
const getExtensionContext = runtime.Extensions.getExtensionContext;
const prismaVersion = {
  client: "7.7.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
const NullTypes = {
  DbNull: runtime.NullTypes.DbNull,
  JsonNull: runtime.NullTypes.JsonNull,
  AnyNull: runtime.NullTypes.AnyNull
};
const DbNull = runtime.DbNull;
const JsonNull = runtime.JsonNull;
const AnyNull = runtime.AnyNull;
const ModelName = {
  Account: "Account",
  Session: "Session",
  VerificationToken: "VerificationToken",
  Authenticator: "Authenticator",
  User: "User",
  Product: "Product",
  Order: "Order",
  OrderItem: "OrderItem",
  Favorite: "Favorite"
};
const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
const AccountScalarFieldEnum = {
  userId: "userId",
  type: "type",
  provider: "provider",
  providerAccountId: "providerAccountId",
  refresh_token: "refresh_token",
  access_token: "access_token",
  expires_at: "expires_at",
  token_type: "token_type",
  scope: "scope",
  id_token: "id_token",
  session_state: "session_state",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
const SessionScalarFieldEnum = {
  id: "id",
  sessionToken: "sessionToken",
  userId: "userId",
  expires: "expires",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
const VerificationTokenScalarFieldEnum = {
  identifier: "identifier",
  token: "token",
  expires: "expires"
};
const AuthenticatorScalarFieldEnum = {
  credentialID: "credentialID",
  userId: "userId",
  providerAccountId: "providerAccountId",
  credentialPublicKey: "credentialPublicKey",
  counter: "counter",
  credentialDeviceType: "credentialDeviceType",
  credentialBackedUp: "credentialBackedUp",
  transports: "transports"
};
const UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  personalId: "personalId",
  primaryMobile: "primaryMobile",
  secondaryMobile: "secondaryMobile",
  country: "country",
  state: "state",
  city: "city",
  detailedAddress: "detailedAddress",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
const ProductScalarFieldEnum = {
  id: "id",
  type: "type",
  cut: "cut",
  preparation: "preparation",
  title: "title",
  slug: "slug",
  description: "description",
  increaseByOne: "increaseByOne",
  specialCut: "specialCut",
  category: "category",
  mainImage: "mainImage",
  images: "images",
  price: "price",
  discount: "discount",
  unit: "unit",
  quantity: "quantity",
  lowQuantity: "lowQuantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isActive: "isActive"
};
const OrderScalarFieldEnum = {
  id: "id",
  orderNumber: "orderNumber",
  total: "total",
  status: "status",
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
  orderStatus: "orderStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
const OrderItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  price: "price",
  orderId: "orderId",
  productId: "productId"
};
const FavoriteScalarFieldEnum = {
  productId: "productId",
  userId: "userId",
  createdAt: "createdAt"
};
const SortOrder = {
  asc: "asc",
  desc: "desc"
};
const QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
const NullsOrder = {
  first: "first",
  last: "last"
};
const defineExtension = runtime.Extensions.defineExtension;

var prismaNamespace = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AccountScalarFieldEnum: AccountScalarFieldEnum,
  AnyNull: AnyNull,
  AuthenticatorScalarFieldEnum: AuthenticatorScalarFieldEnum,
  DbNull: DbNull,
  Decimal: Decimal,
  FavoriteScalarFieldEnum: FavoriteScalarFieldEnum,
  JsonNull: JsonNull,
  ModelName: ModelName,
  NullTypes: NullTypes,
  NullsOrder: NullsOrder,
  OrderItemScalarFieldEnum: OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: OrderScalarFieldEnum,
  PrismaClientInitializationError: PrismaClientInitializationError,
  PrismaClientKnownRequestError: PrismaClientKnownRequestError,
  PrismaClientRustPanicError: PrismaClientRustPanicError,
  PrismaClientUnknownRequestError: PrismaClientUnknownRequestError,
  PrismaClientValidationError: PrismaClientValidationError,
  ProductScalarFieldEnum: ProductScalarFieldEnum,
  QueryMode: QueryMode,
  SessionScalarFieldEnum: SessionScalarFieldEnum,
  SortOrder: SortOrder,
  Sql: Sql,
  TransactionIsolationLevel: TransactionIsolationLevel,
  UserScalarFieldEnum: UserScalarFieldEnum,
  VerificationTokenScalarFieldEnum: VerificationTokenScalarFieldEnum,
  defineExtension: defineExtension,
  empty: empty,
  getExtensionContext: getExtensionContext,
  join: join,
  prismaVersion: prismaVersion,
  raw: raw,
  sql: sql
});

"use strict";
const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
  CLIENT: "CLIENT",
  SUPPLIER: "SUPPLIER"
};
const Category = {
  MEAT: "MEAT",
  PROCESSED: "PROCESSED",
  CHICKEN: "CHICKEN"
};
const Unit = {
  KG: "KG",
  PIECE: "PIECE"
};
const OrderStatus = {
  PENDING: "PENDING",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
const PaymentMethod = {
  VISA: "VISA",
  CASH: "CASH"
};
const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};

var enums = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Category: Category,
  OrderStatus: OrderStatus,
  PaymentMethod: PaymentMethod,
  PaymentStatus: PaymentStatus,
  Role: Role,
  Unit: Unit
});

"use strict";
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
const PrismaClient = getPrismaClientClass();

"use strict";
const globalForPrisma = global;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

"use strict";
const getAllProductsForProductsPage = async (size, page, activeCategory) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / size);
    const data = await prisma.product.findMany({
      where: { isActive: true, category: activeCategory },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        mainImage: true,
        images: true,
        discount: true,
        unit: true,
        specialCut: true,
        slug: true,
        favorites: { select: { userId: true, productId: true } }
      },
      orderBy: { createdAt: "desc" },
      take: size,
      skip: page * size - size
    });
    return { data, totalPages, totalProducts };
  } catch (error) {
    console.error(error);
  }
};
const getOneProduct = async (slug) => {
  try {
    const data = await prisma.product.findUnique({ where: { slug } });
    return data;
  } catch (error) {
    console.error(error);
  }
};
const getAllProductsForProductsServerPage = async (size, page, activeCategory) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / size);
    const data = await prisma.product.findMany({
      where: { category: activeCategory },
      select: { id: true, category: true, discount: true, mainImage: true, price: true, slug: true, title: true, unit: true, isActive: true, quantity: true },
      orderBy: { createdAt: "desc" },
      take: size,
      skip: page * size - size
    });
    return { data, totalPages, totalProducts };
  } catch (error) {
    console.error(error);
  }
};
const getNonTrendingProducts = async (limit = 5) => {
  try {
    const data = await prisma.product.findMany({
      where: { isActive: true, specialCut: false, quantity: { gt: 0 } },
      select: { id: true, title: true, price: true, unit: true, slug: true, quantity: true, description: true },
      take: limit
    });
    return data;
  } catch (error) {
    console.error("Error fetching getNonTrendingProducts: ", error);
    return [];
  }
};

"use strict";
const nonTrendingProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  quantity: z.number(),
  description: z.string()
}));
const fetchButcherProducts = createStep({
  id: "fetch-butcher-products",
  description: "Fetches non-trending products from the butchery API",
  inputSchema: z.object({
    limit: z.number().optional().default(5)
  }),
  outputSchema: nonTrendingProductsSchema,
  execute: async () => {
    return await getNonTrendingProducts(5);
  }
});
const generateExpertResponse = createStep({
  id: "generate-expert-response",
  description: "Converts product data into a friendly Egyptian recommendation",
  inputSchema: nonTrendingProductsSchema,
  outputSchema: z.object({
    finalAnswer: z.string()
  }),
  execute: async ({ inputData, mastra }) => {
    const products = inputData;
    if (!products) {
      throw new Error("Products not found");
    }
    const agent = mastra.getAgent("butcherAgent");
    if (!agent) {
      throw new Error("Agent not found");
    }
    const prompt = `
  \u0627\u0644\u062F\u0648\u0631: \u0623\u0646\u062A \u0627\u0644\u0645\u0647\u0646\u062F\u0633 \u0623\u062D\u0645\u062F\u060C \u062E\u0628\u064A\u0631 \u0627\u0644\u0625\u0646\u062A\u0627\u062C \u0627\u0644\u062D\u064A\u0648\u0627\u0646\u064A \u0627\u0644\u0645\u062A\u062E\u0635\u0635 \u0648\u0627\u0644\u062D\u0627\u0635\u0644 \u0639\u0644\u0649 \u062F\u0631\u0627\u0633\u0627\u062A \u0639\u0644\u064A\u0627 \u0641\u064A \u0627\u0644\u062A\u0646\u0645\u064A\u0629 \u0627\u0644\u0628\u064A\u0626\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u062F\u0627\u0645\u0629.
  \u0627\u0644\u0634\u062E\u0635\u064A\u0629: \u062E\u0628\u064A\u0631 \u0645\u062B\u0642\u0641\u060C \u0644\u0628\u0642\u060C \u0648\u0647\u0627\u062F\u0626. \u062A\u062A\u062D\u062F\u062B \u0628\u0644\u0647\u062C\u0629 \u0645\u0635\u0631\u064A\u0629 "\u0631\u0627\u0642\u064A\u0629" (\u0644\u0647\u062C\u0629 \u0623\u0648\u0644\u0627\u062F \u0627\u0644\u0630\u0648\u0627\u062A \u0648\u0627\u0644\u0645\u062B\u0642\u0641\u064A\u0646). \u0623\u0633\u0644\u0648\u0628\u0643 \u064A\u062C\u0645\u0639 \u0628\u064A\u0646 \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0639\u0644\u0645\u064A\u0629 \u0648\u0627\u0644\u0631\u0642\u064A \u0641\u064A \u0627\u0644\u062A\u0639\u0627\u0645\u0644.
  \u0627\u0644\u0644\u063A\u0629: \u0627\u0644\u0639\u0627\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0627\u0644\u0645\u0647\u0630\u0628\u0629. \u0627\u0633\u062A\u062E\u062F\u0645 \u0643\u0644\u0645\u0627\u062A \u0645\u062B\u0644 (\u062D\u0636\u0631\u062A\u0643\u060C \u0641\u0646\u062F\u0645\u060C \u0630\u0648\u0642 \u0631\u0641\u064A\u0639\u060C \u0645\u0639\u0627\u064A\u064A\u0631\u060C \u062A\u062C\u0631\u0628\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629).

  \u0627\u0644\u0647\u062F\u0641: \u0625\u0642\u0646\u0627\u0639 \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0627\u0642\u062A\u0646\u0627\u0621 \u0623\u0635\u0646\u0627\u0641 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0623\u062D\u062F\u062B \u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0627\u062A \u0639\u0644\u0645 \u0627\u0644\u0646\u0641\u0633 \u0627\u0644\u062A\u0633\u0648\u064A\u0642\u064A (\u0645\u062B\u0644 \u0645\u0628\u062F\u0623 \u0627\u0644\u0646\u062F\u0631\u0629\u060C \u0627\u0644\u062D\u0635\u0631\u064A\u0629\u060C \u0648\u0627\u0644\u0625\u0634\u0628\u0627\u0639 \u0627\u0644\u062D\u0633\u064A):
  ${JSON.stringify(products, null, 2)}

  \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0631\u062F \u0628\u062F\u0642\u0629 \u062A\u0627\u0645\u0629 \u0648\u0641\u0642\u0627\u064B \u0644\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A:

  \u2728 "\u062D\u062A\u0647 \u0644\u062D\u0645\u0629" | \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0627\u062A \u0627\u0644\u062D\u0635\u0631\u064A\u0629 \u0644\u0644\u0645\u0647\u0646\u062F\u0633 \u0623\u062D\u0645\u062F
  \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

  \u{1F3A9} \u0645\u062F\u062E\u0644 \u0627\u0644\u062E\u0628\u0631\u0627\u0621 (\u0647\u064A\u0628\u0629 \u0627\u0644\u062A\u062E\u0635\u0635 - Authority)
  \u2022 [\u0631\u062D\u0628 \u0628\u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0645\u0646\u062A\u0647\u0649 \u0627\u0644\u0631\u0642\u064A. \u0623\u0634\u0631 \u0628\u0627\u062E\u062A\u0635\u0627\u0631 \u0625\u0644\u0649 \u0623\u0646 \u0647\u0630\u0647 \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631\u0627\u062A \u062A\u0645\u062A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0645\u0639\u0627\u064A\u064A\u0631 \u0639\u0644\u0645\u064A\u0629 \u062F\u0642\u064A\u0642\u0629 \u0648\u062E\u0628\u0631\u0629 15 \u0639\u0627\u0645\u0627\u064B \u0641\u064A \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u0641\u0636\u0644 \u0627\u0644\u0633\u0644\u0627\u0644\u0627\u062A\u060C \u0644\u0636\u0645\u0627\u0646 \u062C\u0648\u062F\u0629 \u062A\u0644\u064A\u0642 \u0628\u0645\u0633\u062A\u0648\u0649 \u062A\u0637\u0644\u0639\u0627\u062A \u062D\u0636\u0631\u062A\u0643.]

  \u{1F48E} \u0627\u0644\u0642\u0637\u0639\u0629 \u0627\u0644\u0646\u0627\u062F\u0631\u0629 (\u0627\u0644\u062D\u0635\u0631\u064A\u0629 \u0648\u0627\u0644\u0646\u062F\u0631\u0629 - Scarcity & Exclusivity)
  \u2022 \u0627\u0644\u0642\u0637\u0639\u064A\u0629 \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629: [\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C]
  \u2022 \u0644\u0645\u0627\u0630\u0627 \u0646\u0648\u0635\u064A \u0628\u0647\u0627 \u0627\u0644\u064A\u0648\u0645\u061F: [\u0648\u0636\u062D \u0628\u0623\u0633\u0644\u0648\u0628 \u0644\u0628\u0642 \u0623\u0646 \u0647\u0630\u0647 \u0627\u0644\u0642\u0637\u0639\u0629 "\u0645\u062E\u062A\u0627\u0631\u0629 \u0628\u0639\u0646\u0627\u064A\u0629" (Hand-picked) \u0648\u0623\u0646 \u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u062A\u064A \u0627\u0633\u062A\u0648\u0641\u062A \u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0639\u0644\u0645\u064A\u0629 \u0627\u0644\u064A\u0648\u0645 \u0645\u062D\u062F\u0648\u062F\u0629 \u062C\u062F\u0627\u064B\u060C \u0645\u0645\u0627 \u064A\u062C\u0639\u0644\u0647\u0627 \u0641\u0631\u0635\u0629 \u0644\u0623\u0635\u062D\u0627\u0628 \u0627\u0644\u0630\u0648\u0642 \u0627\u0644\u0631\u0641\u064A\u0639 \u0641\u0642\u0637.]

  \u{1F37D}\uFE0F \u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u062A\u0630\u0648\u0642 (\u0627\u0644\u0625\u063A\u0631\u0627\u0621 \u0627\u0644\u062D\u0633\u064A \u0627\u0644\u0631\u0627\u0642\u064A - Sensory Appeal)
  \u2022 \u0627\u0644\u062E\u0635\u0627\u0626\u0635 \u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0626\u064A\u0629: [\u0635\u0641 \u0627\u0644\u0644\u062D\u0645\u0629 \u0628\u0645\u0635\u0637\u0644\u062D\u0627\u062A \u0631\u0627\u0642\u064A\u0629 \u0645\u062B\u0644: "\u062A\u062F\u0627\u062E\u0644 \u062F\u0647\u0646\u064A \u0645\u062B\u0627\u0644\u064A - Marbling"\u060C "\u0646\u0633\u064A\u062C \u0645\u062E\u0645\u0644\u064A \u0646\u0627\u0639\u0645"\u060C "\u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0646\u0643\u0647\u0627\u062A". \u0627\u062C\u0639\u0644 \u0627\u0644\u0639\u0645\u064A\u0644 \u064A\u062A\u062E\u064A\u0644 \u062C\u0648\u062F\u0629 \u0627\u0644\u062A\u062C\u0631\u0628\u0629.]
  \u2022 \u0641\u0646 \u0627\u0644\u062A\u0642\u062F\u064A\u0645: [\u0627\u0642\u062A\u0631\u062D \u0637\u0631\u064A\u0642\u0629 \u0637\u0647\u064A \u062A\u0644\u064A\u0642 \u0628\u0645\u0627\u0626\u062F\u0629 \u0631\u0627\u0642\u064A\u0629 \u0644\u0625\u0628\u0631\u0627\u0632 \u0641\u062E\u0627\u0645\u0629 \u0627\u0644\u0642\u0637\u0639\u064A\u0629.]

  \u{1F9E0} \u0645\u064A\u062B\u0627\u0642 \u0627\u0644\u062C\u0648\u062F\u0629 (\u0627\u0644\u0637\u0645\u0623\u0646\u0629 \u0627\u0644\u0646\u0641\u0633\u064A\u0629 - Risk Reversal)
  \u2022 [\u0623\u0643\u062F \u0644\u0644\u0639\u0645\u064A\u0644 \u0623\u0646 \u0627\u062E\u062A\u064A\u0627\u0631\u0643 \u0646\u0627\u0628\u0639 \u0645\u0646 \u0627\u0647\u062A\u0645\u0627\u0645\u0643 \u0628\u0627\u0644\u0635\u062D\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0648\u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0635\u062D\u064A\u0629 \u0627\u0644\u0635\u0627\u0631\u0645\u0629\u060C \u0648\u0643\u0623\u0646\u0643 \u062A\u062E\u062A\u0627\u0631 \u0647\u0630\u0647 \u0627\u0644\u0642\u0637\u0639\u0629 \u0644\u0623\u0633\u0631\u062A\u0643 \u0623\u0648 \u0644\u0636\u064A\u0648\u0641\u0643 \u0645\u0646 \u0627\u0644\u0646\u062E\u0628\u0629.]

  \u{1F942} \u062F\u0639\u0648\u0629 \u0644\u0644\u0627\u0642\u062A\u0646\u0627\u0621 (\u0627\u0644\u062A\u062D\u0641\u064A\u0632 \u0627\u0644\u0623\u0646\u064A\u0642 - Elegant CTA)
  \u2022 [\u062E\u0627\u062A\u0645\u0629 \u0645\u062D\u0641\u0632\u0629 \u0628\u0623\u0633\u0644\u0648\u0628 \u063A\u064A\u0631 \u0645\u0628\u0627\u0634\u0631. \u0627\u0642\u062A\u0631\u062D \u0639\u0644\u0649 \u0627\u0644\u0639\u0645\u064A\u0644 "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u062C\u0632" \u0623\u0648 "\u0627\u0642\u062A\u0646\u0627\u0621 \u0627\u0644\u0642\u0637\u0639\u0629" \u0642\u0628\u0644 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0645\u062E\u0635\u0635 \u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u0645\u064A\u0632\u0629.]

  \u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629:
  - \u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0628\u0635\u0631\u064A (\u0627\u0644\u0625\u064A\u0645\u0648\u062C\u064A \u0648\u0627\u0644\u062E\u0637\u0648\u0637 \u0627\u0644\u0641\u0627\u0635\u0644\u0629).
  - \u062A\u062C\u0646\u0628 \u0627\u0644\u0623\u0644\u0641\u0627\u0638 \u0627\u0644\u0634\u0639\u0628\u064A\u0629 \u0623\u0648 \u0627\u0644\u0639\u0627\u0645\u064A\u0629 \u0627\u0644\u0645\u0628\u062A\u0630\u0644\u0629.
  - \u0631\u0643\u0632 \u0639\u0644\u0649 "\u0627\u0644\u0642\u064A\u0645\u0629" (Value) \u0648\u0644\u064A\u0633 "\u0627\u0644\u0633\u0639\u0631".
`;
    const response = await agent.stream([{ role: "user", content: prompt }]);
    let finalAnswer = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      finalAnswer += chunk;
    }
    return { finalAnswer };
  }
});
const butcherWorkflow = createWorkflow({
  id: "butcher-workflow",
  inputSchema: z.object({
    limit: z.number().optional().default(5)
  }),
  outputSchema: z.object({
    finalAnswer: z.string()
  })
}).then(fetchButcherProducts).then(generateExpertResponse);
butcherWorkflow.commit();

"use strict";
const butcherAgent = new Agent({
  id: "butcher-agent",
  name: "Butcher Agent",
  instructions: `
    ## ROLES
    - You are "Eng. Ahmed Mohamed", a professional butcher and owner of the premium brand "Balady". 
    - You are an expert in Animal Production and local Egyptian livestock.
    - Your persona is a trusted advisor, not just a salesman.
    - Make all answers in Arabic.

    ## PERSONALITY & LANGUAGE
    - **Language**: You MUST respond in friendly.
    - **Tone**: Professional, confident, warm, and honest.

    ## SALES PSYCHOLOGY (The Butcher's Secret)
    - NEVER describe products as "slow-moving" or "excess stock".
    - Use the **Halo Effect**: Describe the meat as "Zebda" (butter-like), "Lessa Wasel" (freshly arrived), or "Tarbiya Beyti" (home-raised).
    - Use the **Scarcity/Consistency Principle**: Suggest cuts as "Expert Secrets" (e.g., Moza for boiling, Senn for tagines).
    - **Value-based Selling**: If asked about price, emphasize the premium quality and your 15+ years of expertise.

    ## OPERATIONAL CONSTRAINTS
    - Do not suggest "Special Cuts" unless explicitly requested.
    - Stick strictly to the data returned from the tools.

    # FINAL RESPONSE PROTOCOL (CRITICAL)
    1. After calling a tool, WAIT for the data.
    2. NEVER show JSON or technical parameters to the user.
    3. Synthesize the tool data into a human-like recommendation.
    4. Always start with a warm Arabic greeting.
    5. Convert the tool's product list into a personal suggestion from "Eng. Ahmed".
  `,
  model: ollama("gemma3:4b"),
  // tools: { nonTrendingProductsTool },
  memory: new Memory()
});

"use strict";
const mastra = new Mastra({
  server: {
    apiRoutes: [workflowRoute({
      path: "/workflow",
      workflow: "butcherWorkflow"
    })]
  },
  workflows: {
    weatherWorkflow,
    butcherWorkflow
  },
  agents: {
    weatherAgent,
    butcherAgent
  },
  storage: new MastraCompositeStore({
    id: "composite-storage",
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:D:/WORK/Portfolio/next/balady-mastra/mastra.db"
    })
  })
});

export { mastra };
