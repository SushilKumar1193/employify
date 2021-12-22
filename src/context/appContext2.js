import React, { useContext, useReducer } from 'react'
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER,
  TOGGLE_SIDEBAR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  DELETE_JOB_BEGIN,
  CHANGE_PAGE,
  CLEAR_FILTERS,
} from './actions'
import reducer from './reducer'

import axios from 'axios'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? user : null,
  // user: null,

  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobType: 'full-time',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  status: 'pending',
  statusOptions: ['pending', 'interview', 'declined'],
  stats: {},
  monthlyApplications: [],
  jobs: [],
  totalJobs: 0,
  page: 1,
  numOfPages: 1,
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}
const AppContext = React.createContext()
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

//   const authFetch = axios.create({
//     baseURL: 'api',
//   })
  const  host = "http://localhost:5000";

  // response interceptor
//   authFetch.interceptors.request.use(
//     (config) => {
//       config.headers.common['Authorization'] = `Bearer ${state.token}`
//       return config
//     },
//     (error) => {
//       return Promise.reject(error)
//     }
//   )
//   // response interceptor
//   authFetch.interceptors.response.use(
//     (response) => {
//       return response
//     },
//     (error) => {
//       if (error.response.status === 401) {
//         dispatch({ type: LOGOUT_USER })
//         removeUserFromLocalStorage()
//         return
//       }
//       return Promise.reject(error)
//     }
//   )

  const displayAlert = () => {
    dispatch({
      type: DISPLAY_ALERT,
    })
    clearAlert()
  }
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      })
    }, 3000)
  }

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN })
    try {
    //   const { data } = await axios.post(`${host}/api/auth/register`,currentUser)
    //   console.log(data);
      const {name,email,password} = currentUser;
      const {data} = await fetch("http://localhost:5000/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
        });

      const { user, token, location } = data
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      })
      addUserToLocalStorage({
        user,
        token,
        location,
      })
      
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        // payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }



  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN })
    try {
    //   const { data } = await axios.post(`${host}/api/auth/login`, currentUser)


    const {data} = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        });


      const { user, token, location } = data
      console.log(data)
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      })

      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: LOGIN_USER_ERROR,
        // payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('location')
  }
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER })
    removeUserFromLocalStorage()
  }
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    })
  }
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status, token } = state

    //   await authFetch.post(`${host}/api/jobs/createJob`, {
        // company,
        // position,
        // jobLocation,
        // jobType,
        // status,
    //   })

    const {data} = await fetch("http://localhost:5000/api/jobs/createJob", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({company,position,jobLocation,jobType,status})
        });


      dispatch({
        type: CREATE_JOB_SUCCESS,
      })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: CREATE_JOB_ERROR,
        // payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
    //   const { data } = await authFetch(`${host}/api/jobs/stats`)


    const {data} = await fetch("http://localhost:5000/api/jobs/stats", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({company,position,jobLocation,jobType,status})
        });

    
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
    //   const { data } = await authFetch.patch(`${host}/api/auth/updateUser`, {
    //     ...currentUser,
    //   })


    const {data} = await fetch(`${host}/api/auth/updateUser/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'token' : token
        },
        body: JSON.stringify({...currentUser}) // body data type must match "Content-Type" header
      });

      const { user, token, location } = data

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, location },
      })

      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        // payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state
    let url = `${host}/api/jobs/getAllJobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      // logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } })
  }

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state

      await authFetch.patch(`${host}/api/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })
      dispatch({
        type: EDIT_JOB_SUCCESS,
      })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`${host}/api/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        logoutUser,
        toggleSidebar,
        handleChange,
        clearValues,
        createJob,
        showStats,
        updateUser,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        changePage,
        clearFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider }