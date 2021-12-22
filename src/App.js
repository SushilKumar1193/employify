// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Error, Register } from './pages'
import {
  SharedLayout,
  Stats,
  AllJobs,
  AddJob,
  Profile,
} from './pages/Dashboard'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route index element={<Stats />} />
            <Route path='all-jobs' element={<AllJobs />}></Route>
            <Route path='add-job' element={<AddJob />}></Route>
            <Route path='profile' element={<Profile />}></Route>
          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/landing' element={<Landing />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App