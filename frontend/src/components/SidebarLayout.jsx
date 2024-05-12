import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }) {

    return (
        <div className="bg-slate-100 flex flex-row w-full h-screen items-center">
            <Sidebar />
            <div className="flex-grow h-full p-2">
                <div className="bg-white h-full overflow-y-auto rounded-2xl drop-shadow-lg no-scrollbar p-2">
                    { children }
                </div>
            </div>
        </div>
    )
}