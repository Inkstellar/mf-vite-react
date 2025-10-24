import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RemoteLayout from './components/layout/RemoteLayout';
import Users from './pages/Users';

const App: React.FC = () => {
	useEffect(() => {
		console.log('Remote useEffect');
	}, []);

	return (
		<BrowserRouter>
			<RemoteLayout />
		</BrowserRouter>
	);
};

export default App;
