import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div>
            <Link to="/login" className="cursor-pointer">
                <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup" className="cursor-pointer">
                <Button variant="outline">Sign up</Button>
            </Link>
        </div >
    )
}
