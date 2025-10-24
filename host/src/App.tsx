import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { of, tap } from 'rxjs';
import { AuthProvider } from './auth/AuthContext';
import HostLayout from './components/layout/HostLayout';
import Admin from './pages/Admin';


const App: React.FC = () => {
	useEffect(() => {
		of('emit')
			.pipe(tap(() => console.log("I'm RxJs from host")))
			.subscribe();
	}, []);

	return (
		<BrowserRouter>
			<AuthProvider>
				<HostLayout />
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
