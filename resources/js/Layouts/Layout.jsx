export default function Layout({children}){
  return(
    <div className="min-h-screen">
      <header className="bg-black text-white h-20 font-bold text-left p-4 text-3xl">Taguig City University</header>
      {children}
      <footer className="bg-black text-white h-10 text-center text-3xl">All rights reserved</footer>
    </div>
  )
}