import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
   const Router = useRouter()
   const { doRequest } = useRequest({
      url: '/api/users/signout',
      method: 'post',
      body: {},
      onSuccess: () => Router.push('/'),
   })

   useEffect(() => {
      doRequest()
   }, [])

   return <div>Signing you out...</div>
}
