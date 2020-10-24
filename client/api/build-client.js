import axios from 'axios'

export default ({ req }) => {
   if (typeof window === 'undefined') {
      // We are on server
      // Request should be made to 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
      return axios.create({
         baseURL:
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
         headers: req.headers,
      })
   } else {
      // We are on browser
      // Request can be made to base url of ''
      return axios.create({
         baseURL: '/',
      })
   }
}
