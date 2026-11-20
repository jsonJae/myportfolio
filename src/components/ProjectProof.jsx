// An ongoing project has no screens to show yet, so its card shows a proof
// that is still on the press. The sheet carries real YSEIS tokens, copied
// from the YSEIS frontend's app.css. It is printed in two plates that
// register exactly: the ink plate is printed up to the frontier, the key plate
// shows the rest as unprinted keylines, and the brayer that prints every
// other card keeps working the edge. Everything is sized in container units,
// so the card and the detail spread show the same print at different sizes.
// Styles live with the press in index.css (.proof).

const COLORS = [
    ['blue-600', '#1F6FA3'],
    ['blue-500', '#2BA1DB'],
    ['blue-700', '#175683'],
    ['blue-50', '#EAF5FC'],
    ['ink-900', '#1F2329'],
    ['ink-600', '#5B6370'],
];

const STATUSES = [
    ['Available', '#1E7A46', '#E6F4EC'],
    ['In use', '#6B4FBB', '#F0ECFA'],
    ['Maintenance', '#8A5A00', '#FFF4D6'],
    ['Damaged', '#B54708', '#FEF0E7'],
    ['Overdue', '#B42318', '#FDECEA'],
    ['Removed', '#5B6370', '#EEF1F4'],
];

const TYPE = [
    ['display', 32],
    ['h1', 24],
    ['h2', 20],
    ['h3', 16],
    ['small', 14],
    ['caption', 12],
];

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64];

function Plate({ plate }) {
    return (
        <div data-plate={plate} className="proof-plate">
            <div className="proof-sheet">
                <div className="proof-row">
                    <span className="proof-label">Color</span>
                    <div className="proof-swatches">
                        {COLORS.map(([name, hex]) => (
                            <span key={name}>
                                <span className="proof-swatch" style={{ '--c': hex }} />
                                <span className="proof-name">{name}</span>
                                <span className="proof-note">{hex}</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="proof-row">
                    <span className="proof-label">Status</span>
                    <div className="proof-chips">
                        {STATUSES.map(([label, fg, bg]) => (
                            <span key={label} className="proof-chip" style={{ '--fg': fg, '--bg': bg }}>
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="proof-row">
                    <span className="proof-label">Type</span>
                    <div className="proof-type">
                        {TYPE.map(([name, px]) => (
                            <span key={name} className="proof-spec">
                                <span className="proof-glyph" style={{ '--px': px }}>
                                    Aa
                                </span>
                                <span className="proof-note">
                                    {name} {px}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="proof-row">
                    <span className="proof-label">Space</span>
                    <div className="proof-space">
                        {SPACE.map((px) => (
                            <span key={px} className="proof-step">
                                <span className="proof-bar" style={{ '--px': px }} />
                                <span className="proof-note">{px}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// state follows the card's press: idle (keylines only), printing (the brayer
// inks up to the frontier), live (the brayer keeps working the edge).
export default function ProjectProof({ state = 'live' }) {
    return (
        <div aria-hidden="true" data-state={state} className="proof">
            <Plate plate="key" />
            <Plate plate="ink" />
            <span className="proof-edge" />
            <span className="press-crop" />
            <span className="proof-roller">
                <span className="press-brayer" />
            </span>
            <p className="proof-slug">
                <span>Design tokens</span>
                <span className="proof-status">
                    <span className="proof-dot" />
                    Still printing
                </span>
            </p>
        </div>
    );
}
