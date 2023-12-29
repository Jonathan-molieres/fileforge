import { tertiary } from '@/themes/constants'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { TeamPresentationDataProps } from '../TeamPresentationData'
import TeamsPresentationItemDescription from './TeamPresentationItemDescription'

export default function TeamPresentationItem({
    member,
    index,
}: {
    member: TeamPresentationDataProps
    index: number
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: index % 2 === 0 ? 'flex-end' : 'flex-start' },
                alignItems: 'flex-start',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: '35rem',
                    gap: '1rem',
                }}
            >
                <Image src={member.image} alt={`Photo de ${member.name}`} placeholder="blur" />
                <Box
                    sx={{
                        '&  h4': {
                            lineHeight: '1rem',
                        },
                    }}
                >
                    <Typography variant="h3">{member.name}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4">{member.job}</Typography>
                        <Typography variant="h4" color={tertiary}>
                            &nbsp;{member?.blueText}
                        </Typography>
                    </Box>
                </Box>
                <TeamsPresentationItemDescription member={member} />
            </Box>
        </Box>
    )
}
