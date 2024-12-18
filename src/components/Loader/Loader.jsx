import './Loader.css';
import { ColorRing } from 'react-loader-spinner';

export default function Loader() {
    return (
        <div className="loader">
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#1976d2', '#1466b6', '#10569b', '#0b4781', '#073868']}
            />
        </div>
    )
}