import { appName } from '@/main'
import { useState, type FC } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import PricingCard from '@/components/Dashboard/Cards/Pricing';
import { useCertificateTypes, useStats } from '@/hooks/useSupabase';
import { GrValidate } from "react-icons/gr";
import { LuFileBox } from "react-icons/lu";
import { TbTransfer } from "react-icons/tb";
import { PiCubeFocusFill } from "react-icons/pi";
import routes from '@/utils/routes';
import ObjectTypeCarousel from '@/components/ObjectTypeCarousel';
import CertificateVerification from '@/components/CertificateVerification';
import { FaChevronDown } from 'react-icons/fa';

const HomePage: FC = () => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  const { certificateTypes } = useCertificateTypes();

  const { stats, isLoading: isLoadingStats } = useStats();

  const formatStat = (value: number): string => {
    if (value >= 1000) {
      return `${Math.floor(value / 1000) * 1000}+`;
    }
    if (value >= 100) {
      return `${Math.floor(value / 100) * 100}+`;
    }
    if (value >= 10) {
      return `${Math.floor(value / 10) * 10}+`;
    }
    return value.toString();
  };

  return (
    <div>
      <header>
        <nav className="lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 py-6 px-8 border-b border-emerald-900/30 bg-[#050a08]/90 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between lg:items-center">
            <div className="flex items-center justify-between gap-2">
              <Link to={routes.Home}>
                <img className='max-w-16' src="/logo.png" alt={appName} />
              </Link>
              <button className='lg:hidden' onClick={() => setNavbarOpen(prev => !prev)} type="button">
                {navbarOpen ? <IoMdClose size={22} className='text-white' /> : <RxHamburgerMenu size={22} className='text-neutral-400' />}
              </button>
            </div>

            <ul className={`${navbarOpen ? "flex" : "hidden lg:flex"} mt-6 lg:mt-0 flex-col lg:flex-row lg:items-center gap-4 lg:gap-8`}>
              <li>
                <a href="#features" className="text-neutral-400 hover:text-emerald-400 transition-colors">Fonctionnalités</a>
              </li>
              <li>
                <a href="#search" className="text-neutral-400 hover:text-emerald-400 transition-colors">Rechercher</a>
              </li>
              <li>
                <a href="#pricing" className="text-neutral-400 hover:text-emerald-400 transition-colors">Prix</a>
              </li>
            </ul>

            <Link target='_blank' to={routes.Dashboard.Main} className="mt-6 lg:mt-0 block bg-emerald-700/20 text-emerald-400 border border-emerald-700/50 px-6 py-2 rounded-full">Ouvrir l'application</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="min-h-screen flex flex-col justify-center relative py-32 lg:pt-60 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900/20 to-[#0a1410] pointer-events-none"></div>
          <div className="absolute -left-24 -top-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-8xl font-light text-white mb-8">
              Votre garantie <br />
              <span className="text-emerald-500">d'authenticité.</span>
            </h1>
            <p className="text-xl text-emerald-100/60 mb-12 max-w-2xl mx-auto leading-relaxed italic">
              Authentifiez, gérez et valorisez vos biens d'exception. <br /> Un passeport digital infalsifiable pour chaque objet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={routes.Dashboard.Main} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-bold uppercase hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(5,150,105,0.2)]">
                Démarrer une certification
              </Link>
              <button className="bg-transparent text-emerald-400 border border-emerald-800 px-10 py-5 rounded-full font-bold uppercase hover:bg-emerald-900/20 transition-all">
                Trouver un point de contrôle
              </button>
            </div>
          </div>
          <a
            href="#solutions"
            className="
    absolute
    bottom-10
    left-1/2
    -translate-x-1/2
    flex
    items-center
    justify-center
    w-12
    h-12
    rounded-full
    border
    border-emerald-500/40
    text-emerald-400
    hover:bg-emerald-500/10
    transition
    animate-bounce
    z-20
  "
          >
            <FaChevronDown className="text-xl" />
          </a>
        </section>

        <section id="solutions" className="scroll-mt-32 py-24 bg-emerald-950/10 border-y border-emerald-900/20">
          <ObjectTypeCarousel />
        </section>

        <section id="features" className="scroll-mt-32 py-32 px-6">
          <div className="max-w-[1440px] mx-auto">
            <div className='space-y-2'>
              <h2 className="text-4xl font-light text-white mb-4">Le futur de la <span className="text-emerald-500">propriété.</span></h2>
              <p className="text-neutral-400 italic">Authentifiez, gérez et valorisez chaque objet</p>
            </div>

            <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="group">
                <div className="w-14 h-14 bg-emerald-900/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <GrValidate size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-4">Authenticité confirmée</h3>
                <p className="text-neutral-500 leading-relaxed italic">Contrôlez  l'intégrité et la valeur de votre objet ainsi que les interventions
                  nécessaires.
                </p>
              </div>

              <div className="group">
                <div className="w-14 h-14 bg-emerald-900/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <LuFileBox size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-4">Passeport digital</h3>
                <p className=" text-neutral-500 leading-relaxed italic">Chaque objet possède son certificat numérique unique, contenant caractéristiques, photos, factures et historique.</p>
              </div>

              <div className="group">
                <div className="w-14 h-14 bg-emerald-900/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <TbTransfer size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-4">Transfert sécurisé</h3>
                <p className=" text-neutral-500 leading-relaxed italic">Vendez ou transmettez votre bien avec son certificat officiel en un clic via notre interface sécurisée.</p>
              </div>

              <div className="group">
                <div className="w-14 h-14 bg-emerald-900/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-800/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <PiCubeFocusFill size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-4">Traçabilité totale</h3>
                <p className=" text-neutral-500 leading-relaxed italic">Consultez l'historique complet des propriétaires et bloquez sa revente en cas de vol/perte.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-32 py-24 px-6 bg-emerald-950/10 border-y border-emerald-900/20">
          <div className='max-w-[1440px] mx-auto space-y-8'>

            <div className='lg:w-3/5'>
              <div className='bg-black/60 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row gap-8 items-start'>
                <div className='flex-1 space-y-6'>
                  <h2 className="text-2xl lg:text-4xl text-white font-light">
                    Les <span className='text-red-500'>limites</span> d'un certificat papier
                  </h2>

                  <ul className='space-y-4'>
                    <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                      <span className='text-red-500 mt-1'>•</span>
                      <span>Peut facilement s'abîmer, s'égarer ou être falsifié</span>
                    </li>
                    <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                      <span className='text-red-500 mt-1'>•</span>
                      <span>Même les papiers d'origine ne garantissent pas toujours l'authenticité réelle d'un objet de luxe</span>
                    </li>
                    <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                      <span className='text-red-500 mt-1'>•</span>
                      <span>Inaccessible instantanément</span>
                    </li>
                  </ul>
                </div>

                <img className='max-w-32 object-contain' src="/images/file.png" alt="Les limites d'un certificat papier." />
              </div>
            </div>

            <div className='lg:ml-auto lg:w-3/5'>
              <div className='bg-black/60 rounded-3xl p-8 lg:p-12 space-y-8'>
                <h2 className="text-2xl lg:text-4xl text-white font-light">
                  Les <span className='text-emerald-500'>avantages</span> d'un certificat digital <span className='font-bold'>Certificate</span>
                </h2>

                <ul className='space-y-4'>
                  <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                    <span className='text-emerald-500 mt-1'>•</span>
                    <span>Universel et infalsifiable : une seule preuve valable dans le monde entier</span>
                  </li>
                  <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                    <span className='text-emerald-500 mt-1'>•</span>
                    <span>Accessible partout, à tout moment : vous gardez la maîtrise de vos biens</span>
                  </li>
                  <li className='text-white text-base lg:text-lg flex items-start gap-3'>
                    <span className='text-emerald-500 mt-1'>•</span>
                    <span>Durable : ne dépend pas d'un support fragile ni d'un lieu de stockage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-32 py-32 px-6 bg-[#030706] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full"></div>
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Investissez dans la <span className="text-emerald-500">sûreté.</span></h2>
              <p className="text-emerald-500/60 uppercase  font-bold">Niveaux de certification</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {certificateTypes
                .sort((a, b) => a.price - b.price)
                .filter(certificateType => certificateType.is_active)
                .map(certificateType => (
                  <PricingCard
                    key={certificateType.id}
                    title={certificateType.name}
                    price={certificateType.price}
                    features={certificateType.features}
                    goal={certificateType.goal}
                    buttonText="Certifier"
                    physical={certificateType.physical}
                    isRecommended={certificateType.is_recommended}
                    variant={certificateType.is_recommended ? "premium" : "default"}
                  />
                )
                )}
            </div>

            <p className='text-neutral-400 italic mt-6'>* Les prix peuvent varier selon le point de vente sélectionné</p>
          </div>
        </section>

        <section id="search" className="scroll-mt-32 py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <CertificateVerification />
          </div>
        </section>

        {!isLoadingStats && (
          <section className="scroll-mt-32 py-24 px-6 bg-emerald-950/10 border-y border-emerald-900/20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  La confiance en <span className="text-emerald-500">chiffres</span>
                </h2>
                <p className="text-neutral-400 italic">Des milliers d'objets protégés à travers le monde</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                <div className="text-center group">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                    <div className="relative text-5xl lg:text-7xl font-bold text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                      {formatStat(stats.totalCertifiedObjects)}
                    </div>
                  </div>
                  <p className="text-neutral-300 uppercase text-sm font-bold tracking-wider">
                    Objets certifiés
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                    <div className="relative text-5xl lg:text-7xl font-bold text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                      {formatStat(stats.totalPartners)}
                    </div>
                  </div>
                  <p className="text-neutral-300 uppercase text-sm font-bold tracking-wider">
                    Partenaires
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                    <div className="relative text-5xl lg:text-7xl font-bold text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                      {formatStat(stats.totalBrands)}
                    </div>
                  </div>
                  <p className="text-neutral-300 uppercase text-sm font-bold tracking-wider">
                    Marques
                  </p>
                </div>

                <div className="text-center group">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                    <div className="relative text-5xl lg:text-7xl font-bold text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                      {formatStat(stats.totalReferences)}
                    </div>
                  </div>
                  <p className="text-neutral-300 uppercase text-sm font-bold tracking-wider">
                    Références
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-[#030706] py-12 border-t border-emerald-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-10">
                <Link to={routes.Home}>
                  <img className='max-w-16' src="/logo.png" alt={appName} />
                </Link>
              </div>
              <p className="text-neutral-500 max-w-xs leading-relaxed italic  mb-10">
                Leader européen de la certification d'objets de luxe. Sécurité, traçabilité, transmission.
              </p>
              <div className="flex flex-wrap gap-8">
                <Link to="https://www.instagram.com/certificate.eu/" target='_blank' className="text-emerald-500/50 hover:text-emerald-500 transition-colors uppercase  font-bold">Instagram</Link>
                <Link to="https://www.linkedin.com/showcase/emeracertificate/" target='_blank' className="text-emerald-500/50 hover:text-emerald-500 transition-colors uppercase  font-bold">LinkedIn</Link>
                <Link to="https://www.facebook.com/profile.php?id=61579400144886" target='_blank' className="text-emerald-500/50 hover:text-emerald-500 transition-colors uppercase  font-bold">Facebook</Link>
              </div>
            </div>
            <div className='grid lg:grid-cols-2 gap-8'>
              <div>
                <h5 className="text-white font-bold mb-8 uppercase ">Processus</h5>
                <ul className="space-y-4 text-neutral-500  uppercase font-medium">
                  <li><a href="#garantuee" className="hover:text-emerald-400">Garantie</a></li>
                  <li><a href="#features" className="hover:text-emerald-400">Features</a></li>
                  <li><a href="#pricing" className="hover:text-emerald-400">Tarifs</a></li>
                  <li><a href="#" className="hover:text-emerald-400">Lutte antivol</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-white font-bold mb-8 uppercase ">L'entreprise</h5>
                <ul className="space-y-4 text-neutral-500  uppercase font-medium">
                  <li><a href="#" className="hover:text-emerald-400">Mentions légales</a></li>
                  <li><a href="#" className="hover:text-emerald-400">Politique de Confidentialité</a></li>
                  <li><a href="#" className="hover:text-emerald-400">CGU / CGV</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-950 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600  font-bold uppercase">
            <p>© {new Date().getFullYear()} {appName} for Emera CVR.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage