import { forwardRef } from 'react'

const Button = forwardRef(({
    children,
    variant = 'primary',
    className = '',
    ...props
}, ref) => {
    const baseStyles = 'px-8 py-4 text-lg font-mono rounded-full transition-all duration-300 font-medium cursor-pointer inline-flex items-center justify-center'

    const variants = {
        primary: 'bg-neon-green text-background hover:bg-neon-green/90 glow-green hover:scale-105',
        outline: 'bg-transparent border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 hover:scale-105',
    }

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export { Button }
