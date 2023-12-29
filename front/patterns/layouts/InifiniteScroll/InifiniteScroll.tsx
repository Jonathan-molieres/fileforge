import { Box, SxProps } from '@mui/material'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface InifniteScrollProps {
    children: React.ReactNode[]
    sx?: SxProps
}

export default function InifniteScroll({ children, sx }: InifniteScrollProps) {
    const handleNextPage = async () => {
        console.log('handleNextPage')
        // await search.nextPage()
    }

    const handleRefresh = async () => {
        console.log('handleRefresh')
        // await search.refresh()
    }
    return (
        <InfiniteScroll
            dataLength={children.length} //This is important field to render the next data
            next={handleNextPage}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={handleRefresh}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
            }
            releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
            }
        >
            {children}
        </InfiniteScroll>
    )
}
