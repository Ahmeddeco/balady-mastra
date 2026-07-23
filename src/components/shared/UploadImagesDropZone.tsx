/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { UploadDropzone } from "@/utils/uploadthing"
import { Field, FieldError, FieldLabel } from "../ui/field"

type Props = {
	dbImages?: string[] | string
	dbImage?: string
	label?: string
	imageName?: string
	imagesName?: string
	imageKey?: string | undefined
	errors: string[] | undefined
}

const uploadthingShadcnStyles = {
	container:
		"border-2 border-dashed border-input bg-card hover:bg-accent/5 transition-colors rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center w-full gap-2",
	label: "text-sm font-semibold text-foreground",
	allowedContent: "text-xs text-muted-foreground",
	uploadIcon: "size-12 text-primary stroke-[1.5]",
	button:
		"bg-primary! text-primary-foreground! shadow-sm hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2 cursor-pointer h-9 mt-2",
}

/* ------------------------ UploadManyImagesDropZone ------------------------ */
export function UploadManyImagesDropZone({ dbImages, label = "images", imagesName = "images", errors }: Props) {
	// تحويل وتنظيف البيانات لمنع النصوص الفارغة تماماً
	const parseImages = (input: any): string[] => {
		if (!input) return []
		if (Array.isArray(input)) return input.filter(Boolean)
		return input
			.toString()
			.split(",")
			.map((img: string) => img.trim())
			.filter(Boolean) // 👈 فلترة النصوص الفارغة تماماً للتخلص من الخطأ
	}

	const [images, setImages] = useState<string[]>([])
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
		if (dbImages) {
			setImages(parseImages(dbImages))
		}
	}, [dbImages])

	const handleDeleteManyImages = (index: number) => {
		setImages(images.filter((_, i) => i !== index))
	}

	return (
		<Field>
			<FieldLabel>{label}</FieldLabel>
			<Card className="w-full shadow-sm">
				<CardContent className="flex flex-col gap-3 w-full p-6">
					{/* تحويل المصفوفة إلى نص مفصول بفواصل عند الإرسال للفورم */}
					<Input type="hidden" name={imagesName} value={images.join(",")} />

					{images.length > 0 ? (
						<div className="grid lg:grid-cols-6 grid-cols-3 gap-6">
							{images.map((image, index) => (
								<div key={index} className="relative aspect-square w-full">
									<Image
										src={image}
										alt="Product Image"
										fill
										sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 600px"
										className="w-full h-full object-cover rounded-lg border border-border p-1"
									/>

									<Button
										variant="destructive"
										size="icon"
										onClick={() => handleDeleteManyImages(index)}
										type="button"
										className="absolute -top-2.5 -right-2.5 rounded-full size-6 shadow-sm"
									>
										<X className="size-3.5" />
									</Button>
								</div>
							))}
						</div>
					) : (
						isMounted && (
							<UploadDropzone
								config={{ cn: twMerge }}
								endpoint="manyImagesUploader"
								appearance={{
									container: uploadthingShadcnStyles.container,
									label: uploadthingShadcnStyles.label,
									allowedContent: uploadthingShadcnStyles.allowedContent,
									uploadIcon: uploadthingShadcnStyles.uploadIcon,
									button: uploadthingShadcnStyles.button,
								}}
								onClientUploadComplete={(res: any) => {
									setImages(res.map((r: any) => r.ufsUrl))
									toast.success("Images uploaded successfully")
								}}
								onUploadError={(e: any) => {
									toast.error(`Something went wrong: ${e}`)
								}}
							/>
						)
					)}
				</CardContent>
			</Card>
			<FieldError>{errors}</FieldError>
		</Field>
	)
}

/* ------------------------- UploadOneImagesDropZone ------------------------ */
export function UploadOneImagesDropZone({ dbImage, label = "image", imageName = "image", imageKey, errors }: Props) {
	const [image, setImage] = useState<string>("")
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
		if (dbImage) {
			setImage(dbImage.trim())
		}
	}, [dbImage])

	const handleDeleteOneImages = () => {
		setImage("")
	}

	return (
		<Field>
			<FieldLabel>{label}</FieldLabel>
			<Card className="w-full shadow-sm">
				<CardContent className="flex flex-col gap-3 w-full p-6">
					<Input type="hidden" name={imageName} value={image} key={imageKey} />
					{image && image.length > 0 ? (
						<div className="grid lg:grid-cols-6 grid-cols-3 gap-6">
							<div className="relative aspect-square w-full">
								<Image
									src={image}
									alt="Product Image"
									fill
									sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 600px"
									className="w-full h-full object-cover rounded-lg border border-border p-1"
								/>

								<Button
									variant="destructive"
									size="icon"
									onClick={() => handleDeleteOneImages()}
									type="button"
									className="absolute -top-2.5 -right-2.5 rounded-full size-6 shadow-sm"
								>
									<X className="size-3.5" />
								</Button>
							</div>
						</div>
					) : (
						isMounted && (
							<UploadDropzone
								config={{ cn: twMerge }}
								endpoint="oneImageUploader"
								appearance={{
									container: uploadthingShadcnStyles.container,
									label: uploadthingShadcnStyles.label,
									allowedContent: uploadthingShadcnStyles.allowedContent,
									uploadIcon: uploadthingShadcnStyles.uploadIcon,
									button: uploadthingShadcnStyles.button,
								}}
								onClientUploadComplete={(res: any) => {
									setImage(res[0].ufsUrl)
									toast.success("Image uploaded successfully")
								}}
								onUploadError={(e: any) => {
									toast.error(`Something went wrong: ${e}`)
								}}
							/>
						)
					)}
				</CardContent>
			</Card>
			<FieldError>{errors}</FieldError>
		</Field>
	)
}
