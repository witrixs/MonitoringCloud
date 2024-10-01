import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import './index.css';

// Регистрируем необходимые компоненты
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cpuLoadData, setCpuLoadData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [pinCode, setPinCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPinCode = '0151'; 

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/serverinfo');
      setServerInfo(response.data);
      setError(null);
      setCpuLoadData((prev) => [...prev, response.data.cpuload]);
      setMemoryData((prev) => [
        ...prev,
        {
          total: response.data.mem_total,
          free: response.data.mem_free,
        },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchData();
        setLoading(false);
      }, 3000);

      const interval = setInterval(() => {
        fetchData();
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (pinCode === correctPinCode) {
      setIsAuthenticated(true);
    } else {
      alert('Неправильный пин-код');
    }
  };

  const cpuChartData = {
    labels: Array.from({ length: cpuLoadData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'CPU Load (%)',
        data: cpuLoadData.map((load) => (load * 100).toFixed(2)),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const memoryChartData = {
    labels: Array.from({ length: memoryData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Total Memory (MB)',
        data: memoryData.map((mem) => mem.total),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
      {
        label: 'Free Memory (MB)',
        data: memoryData.map((mem) => mem.free),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 to-red-500 flex flex-col items-center justify-center text-white">
      {!isAuthenticated ? (
        <div className="max-w-sm bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-4 text-center">Вход в панель</h1>
          <input
            type="password"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            placeholder="Введите пин-код"
            className="mb-4 p-2 rounded w-full border border-gray-600 focus:outline-none focus:ring focus:ring-orange-400"
          />
          <button onClick={handleLogin} className="bg-orange-500 hover:bg-orange-700 text-white p-2 rounded w-full transition duration-300">
            Войти
          </button>
        </div>
      ) : (
        <div className="max-w-6xl bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg mt-8">
          <h1 className="text-3xl font-semibold mb-4">Информация о сервере</h1>
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            serverInfo && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <h2 className="text-xl">RafaelloCloud Версия: <span className="font-bold">{serverInfo.version}</span></h2>
                  <p>Активные пользователи (последнии 5 минут): <span className="font-bold">{serverInfo.active_users.last5minutes}</span></p>
                  <p>Веб Сервер: <span className="font-bold">{serverInfo.webserver}</span></p>
                  <p>PHP Версия: <span className="font-bold">{serverInfo.php_version}</span></p>
                  <p>База Данных: <span className="font-bold">{serverInfo.database_type}</span></p>
                  <p>Колличество пользователей: <span className="font-bold">{serverInfo.num_users}</span></p>
                  <p>Колличество файлов: <span className="font-bold">{serverInfo.num_files}</span></p>
                </div>
              </>
            )
          )}
          <div className="mt-8">
            <h2 className="text-2xl mb-4">CPU Load</h2>
            <div style={{ height: '300px' }}>
              <Line data={cpuChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl mb-4">Memory Usage</h2>
            <div style={{ height: '300px' }}>
              <Line data={memoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
