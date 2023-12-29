import Provider from '@/patterns/account/RequireUser/AuthenticateModal/AuthenticateProvider'

export default function Page({ params: { provider } }: { params: { provider: string } }) {
    return <Provider provider={provider} />
}
