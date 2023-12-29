import Header from '../../../app/(public)/_Header/Header'
import { _ } from '@/utils/i18n'
import Navbar from '@/app/(public)/_Navbar'
import InternalServerErrorSection from './InternalServerErrorSection'
interface InternalServerErrorProps {}

export default function InternalServerError({}: InternalServerErrorProps) {
    return (
        <>
            <Navbar />
            <Header hideCrumbs title={_('Oula désolé  😬')}></Header>
            <InternalServerErrorSection />
        </>
    )
}
