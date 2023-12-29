import dynamic from 'next/dynamic'

const Observer = dynamic(() => import('./observer_csr'), {
    ssr: false,
    loading: (props) => {
        console.log(props)
        return <p>Loading...</p>
    },
})

export default Observer
