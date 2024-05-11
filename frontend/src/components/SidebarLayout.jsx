import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }) {

    return (
        <div className="bg-slate-100 flex flex-row w-full h-screen items-center">
            <Sidebar />
            <div className="flex-grow h-full p-2">
                <div className="bg-white h-full rounded-lg drop-shadow-md overflow-y-auto no-scrollbar p-2">
                    { children }
                </div>
            </div>
        </div>
    )
}