import RequireUser from '@/patterns/account/RequireUser'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <RequireUser staff>{children}</RequireUser>
}
