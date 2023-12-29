'use client'

import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react'
import arrow from './arrow.svg'
import React from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Box } from '@mui/material'

const Arrow = ({ left }: { left?: boolean }) => (
    <Image
        src={arrow.src}
        alt={'icon'}
        width={arrow.width}
        height={arrow.height}
        className={`custom-${left ? 'prev' : 'next'}prev`}
        style={{
            cursor: 'pointer',
            transform: `rotate(${left ? 0 : 180}deg)`,
        }}
    />
)

export default function Swiper({ children }: { children: React.ReactNode }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap="20px">
            <Arrow left />
            <ReactSwiper
                modules={[Navigation]}
                spaceBetween={20}
                style={{
                    maxWidth: '55rem',
                    display: 'grid',
                    gridAutoRows: '1fr 1fr 1fr',
                }}
                loop={true}
                slidesPerView={3}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                autoplay={{
                    delay: 500,
                }}
            >
                {React.Children.map(children, (child, index) => (
                    <SwiperSlide key={index}>{child}</SwiperSlide>
                ))}
            </ReactSwiper>
            <Arrow />
        </Box>
    )
}
