import axios from 'axios'

export const blogAxios = axios.create({
    withCredentials: false,
    baseURL: 'http://localhost:8093'
})

export const imageRepositoryURL = 'http://localhost/sysadmin/'