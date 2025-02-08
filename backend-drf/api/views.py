from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework import status
from rest_framework.response import Response
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score


class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

            now = datetime.now() # todays date

            
            start = datetime(now.year-10, now.month, now.day) # 10 years before (2014, jan, 16)
            end = now
            df = yf.download(ticker, start, end)
            print(df)
            if df.empty:
                return Response({'error': 'No data found for the given ticker.', 
                                 'status': status.HTTP_404_NOT_FOUND})
            
            df = df.reset_index()
            
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,6))
            plt.plot(df.Close, label='Closing Price')
            plt.title(f'{ticker} Closing Price')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            # save plot to the file
            plot_img_path = f'{ticker}_plot.png'
            plot_img = save_plot(plot_img_path)
            
            
            # 100 days moving avarage
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,6))
            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma100, 'r', label='100-Days MA')
            plt.title(f'{ticker} Stock with 100 days moving avarage')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            # save plot to the file
            plot_img_path = f'{ticker}_100D_MA.png'
            plot_100DMA = save_plot(plot_img_path)


            # 200 days moving avarage
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,6))
            plt.plot(df.Close, label='Closing Price')
            plt.plot(ma200, 'g', label='200-Days MA')
            plt.title(f'{ticker} Stock with 200 days moving avarage')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            # save plot to the file
            plot_img_path = f'{ticker}_200D_MA.png'
            plot_200DMA = save_plot(plot_img_path)


            # Spliting data into training and testing
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])    


            # Scaling down data between 0-1
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load ML model
            model = load_model('stock_prediction_model.keras')
            

            # Preparing test data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []

            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100: i])
                y_test.append(input_data[i, 0])
            x_test, y_test = np.array(x_test), np.array(y_test)

            
            # Making prediction
            y_predicted = model.predict(x_test)

            # Revert the scale price to original price
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            print('y_predicted ==>', y_predicted)
            print('y_test ==>', y_test)

            # final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,6))
            plt.plot(y_test, 'b', label='Original Price')
            plt.plot(y_predicted, 'r', label='Predicted Price')
            plt.title(f'Final prediction of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()

            # Save plot
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_prediction = save_plot(plot_img_path)



            # Model Evalution
            #  Mean squared error
            mse = mean_squared_error(y_test, y_predicted)

            # Root Mean Squared Error
            rmse = np.sqrt(mse)

            # R-squared
            r2 = r2_score(y_test, y_predicted)

            return Response({'status': 'success',
                             'plot_img': plot_img,
                             'plot_100DMA': plot_100DMA,
                             'plot_200DMA': plot_200DMA,
                             'plot_prediction': plot_prediction,
                             'mse': mse,
                             'rmse': rmse,
                             'r2': r2,
                             })


