import Stamp from "./Stamp";

const EmptyState = ({ stamp = "Nothing yet", title, children, action }) => (
    <div className="tb-slip mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
        <Stamp status="pending" label={stamp} size="lg" />
        <h2 className="mt-8 font-display text-2xl">{title}</h2>
        {children && <p className="mt-2 max-w-sm text-ink-soft">{children}</p>}
        {action && <div className="mt-6">{action}</div>}
    </div>
);

export default EmptyState;
