import React, { useEffect, useState } from 'react'
import axiosInstence from '../../axiosInstence'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
    const [ticker, setTicker] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMA100] = useState()
    const [ma200, setMA200] = useState()
    const [predict, setPredict] = useState()

    const [mse, setMSE] = useState()
    const [rmse, setRMSE] = useState()
    const [r2, setR2] = useState()

   
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstence.get('/protected-view')
            }
            catch(error){
                console.log('Error fetching data:', error )
            }
        }
        fetchProtectedData();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const response = await axiosInstence.post('/predict/', {
                ticker: ticker
            });
            console.log(response.data);

            // Set plot
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT
            const plotURL = `${backendRoot}${response.data.plot_img}`
            const ma100URL = `${backendRoot}${response.data.plot_100DMA}`
            const ma200URL = `${backendRoot}${response.data.plot_200DMA}`
            const predictURL = `${backendRoot}${response.data.plot_prediction}`
            setPlot(plotURL)
            setMA100(ma100URL)
            setMA200(ma200URL)
            setPredict(predictURL)

            setMSE(response.data.mse)
            setRMSE(response.data.rmse)
            setR2(response.data.r2)


            if (response.data.error){
                setError(response.data.error)
            }
            else {
                setError(null); 
                // console.log('Prediction successful:', response.data);
            }

        }catch(error){
            console.error('There was an error making the api request', error)
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <>
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 mx-auto'>
                <form onSubmit={handleSubmit}>
                    <input type="text" className='form-control' placeholder='Enter Stock Ticker' 
                    onChange={(e) => setTicker(e.target.value)} required
                    />
                    <small>{error && <div className='text-danger'>{error}</div>}</small>
                    <button type='submit' className='btn btn-info d-block mx-auto mt-3'>
                        {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />Please wait..</span>: 'See Prediction'}
                    </button>
                </form>

            </div>

            {predict && (
                 
                <div className='prediction mt-5'>
                    <div className='p-3'>
                        {plot && (
                            <img src={plot} style={{ maxWidth: '100%'}}/>
                        )}
                    </div>

                    <div className='p-3'>
                        {ma100 && (
                            <img src={ma100} style={{ maxWidth: '100%'}}/>
                        )}
                    </div>
            
                    <div className='p-3'>
                        {ma200 && (
                            <img src={ma200} style={{ maxWidth: '100%'}}/>
                        )}
                    </div>
                
                    <div className='p-3'>
                        {predict && (
                            <img src={predict} style={{ maxWidth: '100%'}}/>
                        )}
                    </div>
                

                    <div className='text-light p-3'>
                        <h4>Model Evalution</h4>
                        <p>Mean Square Error (MSE): {mse}</p>
                        <p>Root Mean Square Error (RMSE): {rmse}</p>
                        <p>R-Squared: {r2}</p>
                    </div>
                </div>


            )}

           

        </div>
    </div>
    </>
  )
}
export default Dashboard