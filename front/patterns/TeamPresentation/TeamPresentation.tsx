import Section from '@/patterns/layouts/Section'
import { _ } from '@/utils/i18n'
import TeamPresentationData from './TeamPresentationData'
import TeamPresentationItem from './TeamPresentationItem/TeamPresentationItem'

export default function TeamPresentation() {
    return (
        <Section
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: '1.94rem',
                mt: '4rem',
                px: { xs: 2 },
            }}
            flat
        >
            {TeamPresentationData.map((member, index) => (
                <TeamPresentationItem key={index} member={member} index={index} />
            ))}
        </Section>
    )
}
