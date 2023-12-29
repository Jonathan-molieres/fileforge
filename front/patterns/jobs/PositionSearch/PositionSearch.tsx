'use client'

import PositionSearch from '@/models/jobs/PositionSearch'
import PositionSearchInfiniteScroll from '@/patterns/layouts/InifiniteScroll'
import PositionCard from '@/app/(public)/nos-offres/[slug]/[id]/PositionCard'
import Section from '@/patterns/layouts/Section'

interface PositionSearchProps {
    search: PositionSearch
}

export default function _PositionSearch({ search }: PositionSearchProps) {
    const { rows } = search
    return (
        <PositionSearchInfiniteScroll search={search}>
            {rows.map((position) => {
                return <PositionCard key={position.id} position={position} />
            })}
        </PositionSearchInfiniteScroll>
    )
}
