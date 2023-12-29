'use client'

import { _ } from '@/utils/i18n'
import { Box, SxProps, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Candidate from '@/models/jobs/Candidate'
import api from '@/utils/api'
import { observer } from 'mobx-react'

interface CandidateResumeBadgeProps {
    candidate: Candidate
    sx?: SxProps
}

const generateResumeExplanationText = (isSync: boolean) => {
    return _(
        `${
            isSync
                ? '<span style={{color: "red"}}>Ce CV est synchronisé</span>'
                : "Ce CV n'est pas synchronisé"
        }

Lorsque les CV sont synchronisés, vous pouvez effectuer des recherches de mots-clés à l'intérieur. Cela signifie que vous obtiendrez des résultats pertinents en cherchant des compétences, des expériences ou d'autres informations spécifiques contenues dans les CV.
`,
        {
            html: true,
        }
    )
}

export default observer(function CandidateResumeBadge({
    candidate,
    sx,
}: CandidateResumeBadgeProps) {
    const explanationText = generateResumeExplanationText(candidate.resumeIsSynced ?? false)
    return (
        <Tooltip title={explanationText}>
            <Box>
                {candidate.haveResume && candidate.resumeIsSynced && <CheckIcon color="success" />}
                {candidate.haveResume && !candidate.resumeIsSynced && <CheckIcon color="warning" />}
                {!candidate.haveResume && <CloseIcon color="error" />}
            </Box>
        </Tooltip>
    )
})

export const avg = (arr: number[]) => arr?.reduce((acc, v, i, a) => acc + v / a.length, 0) ?? 0

export const Accurate = (params: any) => {
    const candidate: Candidate = params.row
    const percent = Math.floor(avg(Object.values(candidate.searchRanks ?? [])) * 100)
    return (percent !== 0 && <>{percent}%</>) || <></>
}
