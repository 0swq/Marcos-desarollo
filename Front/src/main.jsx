import {StrictMode} from 'react'
import {ClerkProvider} from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import {createRoot} from "react-dom/client";
import {esES} from '@clerk/localizations'
import {MantineProvider} from '@mantine/core'
import '@mantine/core/styles.css'
import {TooltipProvider} from "@/Components/ui/tooltip.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <TooltipProvider>
        <ClerkProvider
            localization={esES}
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            appearance={{
                variables: {
                    colorPrimary: '#3498db',
                    colorBackground: '#ffffff',
                    colorText: '#2c3e50',
                    colorTextSecondary: '#7f8c8d',
                    colorInputBackground: '#f8f9fa',
                    borderRadius: '0.75rem',
                }
            }}
        >
            <MantineProvider>
                <App/>
            </MantineProvider>

        </ClerkProvider>
         </TooltipProvider>
    </StrictMode>
)



