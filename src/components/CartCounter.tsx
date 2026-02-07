import styled from 'styled-components';

interface CartCounterProps {
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

export default function CartCounter({ quantity, onAdd, onRemove }: CartCounterProps) {
    return (
        <StyledWrapper>
            <div className="container">
                {/* Minus Button */}
                <div className="toggle" onClick={onRemove}>
                    <span className="button" />
                    <span className="label">–</span>
                </div>

                {/* Count Display */}
                <div className="count-display">
                    {quantity}
                </div>

                {/* Plus Button */}
                <div className="toggle" onClick={onAdd}>
                    <span className="button" />
                    <span className="label">+</span>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    .container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: scale(0.35);
        transform-origin: center;
        margin: -25px -30px;
    }

    .count-display {
        min-width: 50px;
        text-align: center;
        font-size: 48px;
        font-weight: 800;
        color: var(--text-primary, #1d1d1f);
        text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
    }

    .toggle {
        box-shadow:
            inset 0 0 35px 5px rgba(0, 0, 0, 0.25),
            inset 0 2px 1px 1px rgba(255, 255, 255, 0.9),
            inset 0 -2px 1px 0 rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        background: #ccd0d4;
        position: relative;
        height: 100px;
        width: 100px;
        cursor: pointer;
        user-select: none;
        transition: transform 0.1s ease;
    }

    .toggle:hover {
        transform: scale(1.05);
    }

    .toggle:active {
        transform: scale(0.95);
    }

    .toggle:before {
        box-shadow: 0 0 17.5px 8.75px #fff;
        border-radius: 80px;
        background: #fff;
        position: absolute;
        margin-left: -36px;
        margin-top: -36px;
        opacity: 0.2;
        content: "";
        height: 72px;
        width: 72px;
        left: 50%;
        top: 50%;
    }

    .toggle .button {
        -webkit-filter: blur(1px);
        -moz-filter: blur(1px);
        filter: blur(1px);
        transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
        box-shadow:
            0 15px 25px -4px rgba(0, 0, 0, 0.5),
            inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2),
            0 -10px 15px -1px rgba(255, 255, 255, 0.6),
            inset 0 3px 4px -1px rgba(255, 255, 255, 0.2),
            inset 0 0 5px 1px rgba(255, 255, 255, 0.8),
            inset 0 20px 30px 0 rgba(255, 255, 255, 0.2);
        border-radius: 68px;
        position: absolute;
        background: #ccd0d4;
        margin-left: -34px;
        margin-top: -34px;
        display: block;
        height: 68px;
        width: 68px;
        left: 50%;
        top: 50%;
    }

    .toggle .label {
        transition: color 300ms ease-out;
        text-shadow:
            1px 1px 3px #ccd0d4,
            0 0 0 rgba(0, 0, 0, 0.8),
            1px 1px 4px #fff;
        line-height: 100px;
        text-align: center;
        position: absolute;
        font-weight: 700;
        font-size: 36px;
        display: block;
        opacity: 0.9;
        height: 100%;
        width: 100%;
        color: rgba(0, 0, 0, 0.4);
    }

    .toggle:active .button {
        box-shadow:
            0 15px 25px -4px rgba(0, 0, 0, 0.4),
            inset 0 -8px 30px 1px rgba(255, 255, 255, 0.9),
            0 -10px 15px -1px rgba(255, 255, 255, 0.6),
            inset 0 8px 25px 0 rgba(0, 0, 0, 0.4),
            inset 0 0 10px 1px rgba(255, 255, 255, 0.6);
    }

    .toggle:active .label {
        font-size: 34px;
        color: rgba(0, 0, 0, 0.45);
    }

    /* Dark mode support */
    [data-theme="dark"] & .count-display {
        color: #fff;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    }

    [data-theme="dark"] & .toggle {
        background: #3a3a3c;
        box-shadow:
            inset 0 0 35px 5px rgba(0, 0, 0, 0.4),
            inset 0 2px 1px 1px rgba(255, 255, 255, 0.2),
            inset 0 -2px 1px 0 rgba(0, 0, 0, 0.4);
    }

    [data-theme="dark"] & .toggle .button {
        background: #3a3a3c;
    }

    [data-theme="dark"] & .toggle .label {
        color: rgba(255, 255, 255, 0.6);
        text-shadow:
            1px 1px 3px #2c2c2e,
            0 0 0 rgba(255, 255, 255, 0.3),
            1px 1px 4px #1c1c1e;
    }
`;
