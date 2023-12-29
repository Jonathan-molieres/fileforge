'use client'

import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import TableState, { TableColumn } from './Context'
import TableHeaderFilters from './TableHeaderFilters'
import { gradient } from '@/themes/constants'

export interface TableHeadCellProps<R> {
    table: TableState<R>
    columnIndex: number
    column: TableColumn<R>
}

export default observer(function TableHeadCell<R>({
    table,
    column,
    columnIndex,
}: TableHeadCellProps<R>) {
    const handleClick = (e: any) => {
        table.headCellClick(column)
    }

    return (
        <TableCell
            sx={{
                p: column.noGutter ? '4px 5px' : '4px 14px',
                textOverflow: 'ellipsis',
                backgroundColor: 'secondary.main',
                cursor: 'pointer',
                ...(table.hoveredColumnIndex === columnIndex && {
                    backgroundColor: 'primary.main',
                }),
                ...column.headSx,
            }}
            onClick={handleClick}
        >
            <Box
                sx={{
                    textAlign: column.center ? 'center' : '',
                    display: 'flex',
                    justifyContent: column.center ? 'center' : '',
                    // alignContent: 'center',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    verticalAlign: 'middle',
                }}
            >
                {column.label}
                {/* {column.sort === 'asc' && '▲'}
                {column.sort === 'desc' && '▼'} */}
            </Box>
        </TableCell>
    )
})

// const ref = useRef<HTMLTableCellElement>(null)
// <Box
//     sx={{
//         position: 'relative',
//         p: 2,
//         ...(table.hoveredColumnIndex === columnIndex && {
//             backgroundColor: 'secondary.light',
//         }),
//     }}
// >
//     <Box
//         ref={ref}
//         sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             transition: 'transform 0.3s ease',
//             // transform: shrink ? 'translate3d(-15px, 15px,0) rotate(-90deg)' : '',
//             textOrientation: shrink ? 'vertical-rl' : 'inherit',
//             writingMode: shrink ? 'vertical-rl' : 'inherit',
//             zIndex: 1,
//             transformOrigin: 'top left',
//             whiteSpace: 'nowrap',
//             backgroundColor: 'primary.main',
//             py: 0.2,
//             px: 1,
//             borderRadius: '0.5rem',
//             // position: 'absolute',
//             // bottom: 0,
//             // ...(table.hoveredColumnIndex === columnIndex && {
//             //     backgroundColor: 'secondary.light',
//             // }),
//         }}
//     >
//     </Box>
//     {table.showFilters && <TableHeaderFilters column={column} />}
// </Box>
// </TableCell>
// const [shrink, setShrink] = React.useState(column.shrink)

// const updateShrink = (force?: boolean) => {
//     const element = ref.current
//     if (element && element.parentElement?.parentElement) {
//         const box = element.getBoundingClientRect()
//         const parentBox = element.parentElement.parentElement.getBoundingClientRect()
//         setShrink(box.left < 0 || box.right > parentBox.right)
//         table.setShrink(columnIndex, box.width)
//     }
// }
// useEffect(() => {
//     const handleResize = () => {
//         updateShrink(true)
//     }
//     const interval = setInterval(() => {
//         !shrink && updateShrink()
//     }, 1000)
//     window.addEventListener('resize', handleResize)
//     return () => {
//         clearTimeout(interval)
//         window.removeEventListener('resize', handleResize)
//     }
// }, [ref.current, shrink])
