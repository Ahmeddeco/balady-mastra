"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
	mainImage: string
	images: string[]
	alt: string
}

export default function ImageSlider({ images, mainImage, alt = "image" }: Props) {
	const allImagesArray = [mainImage, ...images]
	const [activeImage, setActiveImage] = useState(allImagesArray[0])

	return (
		<div className="size-full aspect-square flex flex-col lg:gap-4 gap-2 ">
			<div className=" w-full h-10/12 relative">
				<Image src={activeImage} alt={alt} fill className="object-cover rounded-xl" />
			</div>
			<div className="w-full h-2/12  rounded-lg  overflow-x-auto flex lg:gap-4 gap-2 ">
				{allImagesArray.map((image, index) => (
					<div
						className={`rounded-lg aspect-video relative  h-full ${activeImage === image ? "border-2 border-primary" : "border"}`}
						key={index}
						onClick={() => setActiveImage(image)}
					>
						<Image src={image} alt={alt} fill className="object-cover rounded-lg" />
					</div>
				))}
			</div>
		</div>
	)
}
