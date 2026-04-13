export const createSlug = (name: string | undefined) => {
  if (!name) {
    throw new Error('Name is required')
  }

  const slug = name
    .toLowerCase()                   // Convert to lowercase
    .trim()                          // Remove leading/trailing whitespace
    .normalize('NFD')                // Normalize unicode (handles accents)
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '')    // Remove non-alphanumeric characters (keep spaces/hyphens)
    .replace(/[\s_]+/g, '-')         // Replace spaces and underscores with a hyphen
    .replace(/-+/g, '-')            // Remove consecutive hyphens
  return slug
}