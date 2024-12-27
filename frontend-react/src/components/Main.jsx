import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'


const Main = () => {
  return (
    <>

      <div className='container'>
        <div className='p-5 text-center bg-light-dark rounded'>
          <h1 className='text-light'>Stock Prediction Portal</h1>
          <p className='text-light lead'>This stock prediction application utilizes machine learning techiniques specially Keras, Tensorflow, and LSTM models, integrated within the django framework. It forcastes the future stock prices by analyzing 100-days and 200-day moving avarages essential indicator widly used by stock analyst to inform trading and investment desigions. </p>
          <Button text="OK" class="btn-outline-light" url='/dashboard'/>
        </div>
      </div>

    </>
  )
}

export default Main