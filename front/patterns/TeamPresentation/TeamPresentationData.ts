import { StaticImageData } from 'next/image'
import React from 'react'
import { _ } from '../../utils/i18n'
import Alban from './images/alban.png'
import Beatrice from './images/beatrice.png'
import Cedric from './images/cedric.png'
import Charlotte from './images/charlotte.png'
import Delphine from './images/delphine.png'
import Emilie from './images/emilie.png'
import Emma from './images/emma.png'
import Laurie from './images/laurie.png'
import Marie from './images/marie.png'
import Marion from './images/marion.png'
import Nathalie from './images/nathalie.png'
import Nicolas from './images/nicolas.png'
import Robin from './images/robin.png'
import Romelie from './images/romelie.png'

export interface TeamPresentationDataProps {
    name: React.ReactNode
    image: StaticImageData
    job: React.ReactNode
    blueText?: React.ReactNode
    description: any
    tags?: React.ReactNode[]
}

const TeamsPresentationData: TeamPresentationDataProps[] = [
    {
        name: _("Nicolas D'HOOGHE"),
        image: Nicolas,
        job: _('Directeur des Agences W&Y'),
        description: _(
            "Après un parcours dans le secteur du BTP et de l’électronique sur des fonctions commerciales puis de gestion de centre de profit, j’ai pris un virage il y a 10 ans pour travailler dans le secteur du recrutement. Aujourd’hui, je suis le Directeur du cabinet de recrutement Work&You et en charge de la gestion, du management et du commerce. Je gère également quelques comptes nationaux en direct et réalise l'expertise technique sur le secteur du BTP pour nos recrutements. Nous sommes précurseurs dans le recrutement prédictif. Nos valeurs : La satisfaction client, l’expertise métier et l’exigence. Notre vision : Faire partie des 3 premiers cabinets de recrutement en France dans nos secteurs d’activité."
        ),
        tags: [_('Innovant'), _('Passionné'), _('Entreprendre')],
    },
    {
        name: _("Béatrice D'HOOGHE"),
        image: Beatrice,
        job: _("Directrice d'Agence -"),
        blueText: _('Bordeaux'),
        description: _(
            'Après plusieurs années dans le management d’équipe, de gestion, de conduite de changement, quoi de plus naturel que de travailler dans le recrutement. Associer ces compétences au recrutement prédictif cela nous permet de forger notre expertise métier au service de nos clients. Quand on choisit de travailler dans les ressources humaines, c’est le plus souvent pour des raisons liées à la rencontre avec d’autres, la notion d’échange, la dimension sociétale, l’intérêt pour l’humain. Mon expertise au service de l’agence de Bordeaux me permet également d’être sensible au management des nouvelles générations - comment leur donner envie de rester à nos cotés !'
        ),
        tags: [_('Manager'), _('Visionnaire'), _('Volontaire')],
    },
    {
        name: _('Émilie PANGRAZZI'),
        image: Emilie,
        job: _("Directrice d'Agence -"),
        blueText: _('Agen'),
        description: _(
            "Depuis plus de 9 ans j'exerce différentes fonctions dans le marketing, la communication et le commerce dans le domaine de l'agroalimentaire. J'ai pu analyser et cibler les besoins de mes clients afin de toujours les satisfaire. Mon intérêt est qu'ensemble nous puissions tout mettre en œuvre pour que votre société se développe grâce à des candidats qui répondent au mieux à vos besoins. Work&You me donne l'opportunité de faire un métier passionnant et intéressant. Challengeuse je suis prête à relever le défi, je saurai être à votre écoute et saurai être force de proposition. Je suis Responsable Compte Clé, je gére et développe un porte feuille et je recrute aussi pour mes clients."
        ),
        tags: [_('Challengeuse'), _('Dynamique'), _('Accompagnement')],
    },
    {
        name: _("Delphine D'HOOGHE"),
        image: Delphine,
        job: _('Responsable Administrative'),
        description: _(
            'Après un parcours de plus de vingt ans dans le secteur de la grande distribution et la distribution spécialisée, j’ai choisi il y a cinq ans de me réorienter sur un poste clé des agences Work&You : La gestion administrative et commerciale de l’entreprise. De manière plus détaillée, je suis en charge de la gestion comptable, sociale, juridique, ainsi que la formation et la facturation. Appelez-nous au standard, vous aurez la chance de m’entendre ! Réactivité, rigueur, organisation, adaptation sont mes qualités qui me caractérise pour mener à bien les valeurs de l’entreprise.'
        ),
        tags: [_('Discrète'), _('Professionnelle'), _('Sportive')],
    },
    {
        name: _('Marie JABALOYAS'),
        image: Marie,
        job: _('Consultante Recrutement &'),
        blueText: _('Formation'),
        description: _(
            'Après cinq années passées dans le travail temporaire, c’est en 2017 que j’intègre le cabinet Work&You en qualité de Consultante. C’était pour moi l’opportunité d’intégrer une entreprise dynamique dotée d’outils performants, et de me consacrer exclusivement au recrutement, domaine qui m’anime depuis toujours. J’apporte tout particulièrement mon expertise sur les métiers du secteur Agroalimentaire que je maîtrise grâce à mes expériences passées. Très attachée au contact humain, et dotée d’un esprit d’analyse, j’interviens sur le recrutement de profils spécifiques avec une mission précise : déceler les compétences, analyser le savoir-être et les aptitudes de nos candidats, afin de répondre précisément aux besoins de nos clients.'
        ),
        tags: [_('À l’écoute'), _('Persévérante'), _('Organisée')],
    },
    {
        name: _('Romélie OVELHEIRO'),
        image: Romelie,
        job: _('Responsable compte clé -'),
        blueText: _('Rodez'),
        description: _(
            "Titulaire d’un MBA en commerce international et de 5 ans d’expérience dans le commerce, dont 4 ans dans l’agroalimentaire, j’ai souhaité m’orienter vers un métier où l'humain est au cœur du sujet et ce, dans une entreprise en adéquation avec mes valeurs propres. Work&You utilise des outils et des méthodes de recrutement novateurs qui me permettent de présenter aux clients des candidats aux compétences certaines mais aussi, dotés de la personnalité adaptée au métier et à l’entreprise. Sensible à la qualité des relations interpersonnelles, je mets tout en œuvre pour vous satisfaire et répondre à votre demande."
        ),
        tags: [_('Bienveillante'), _('Authentique'), _('Impliquée')],
    },
    {
        name: _('Robin PARISOT'),
        image: Robin,
        job: _("Directeur d'Agence -"),
        blueText: _('Nantes'),
        description: _(
            "Après 8 ans dans le commerce d'articles de sport où j'ai eu la chance de pouvoir recruter et manager des équipes passionnées, j'ai décidé de consacrer toute mon énergie à faire ce que j'aime : provoquer les réussites humaines. La satisfaction client a toujours fait partie de mon ADN et mon parcours professionnel m'a permis de me forger des valeurs humaines fortes basées sur la proximité et la transparence, c'est pour cela que j'ai choisi le cabinet de recrutement Work&You. À l'écoute de vos besoins, je vous apporterai toute mon expertise pour détecter les meilleurs talents qui pourront s'épanouir et vous aider à faire grandir votre entreprise."
        ),
        tags: [_('Engagé'), _('Proximité'), _('Workhardandhavefun')],
    },
    {
        name: _('Cédric LEFEBVRE'),
        image: Cedric,
        job: _("Directeur d'Agence -"),
        blueText: _('Toulouse'),
        description: _(
            'Après avoir parcouru le monde pour remplir des missions aussi diverses que variées dans le BTP, le Management et la Sécurité, le contact humain est devenu une évidence. Je me suis alors réorienté vers le recrutement pour le Ministère des Armées pour qui la motivation et la personnalité sont très importantes. Le recrutement prédictif est une réelle avancée pour les entreprises, en effet il permet de cibler le plus rigoureusement possible le profil recherché en prenant en compte toutes les facettes du poste à pourvoir. Le cabinet Work&You utilise ce type de recrutement et je mettrai tout en œuvre pour satisfaire le besoin de votre entreprise quelque soit votre domaine d’action et ainsi vous trouver le candidat adéquat.'
        ),
        tags: [_('Rigueur'), _('Perspicace'), _('Polyvalence')],
    },
    {
        name: _('Laurie RUIZ'),
        image: Laurie,
        job: _('Consultante en Recrutement -'),
        blueText: _('Agen'),
        description: _(
            'Après une licence de psychologie et une expérience dans l’assistanat dentaire, je me suis dirigée vers les ressources humaines pour compléter mon cursus en psychologie. Lors de mes différents stages pour valider mon Bachelor en RH, j’ai eu la chance de découvrir plusieurs secteurs d’activité et plusieurs missions confiées à un Gestionnaire de Ressources Humaines. Parmi elles, je me suis dirigée dans le recrutement, domaine que j’aime particulièrement pour sa précision et sa rigueur. Je prends désormais à cœur de satisfaire nos clients en leur trouvant le candidat idéal. #Dynamique#Curieuse#Organisée'
        ),
    },
    {
        name: _('Nathalie CHARBONNIER'),
        image: Nathalie,
        job: _("Directrice d'Agence -"),
        blueText: _('Paris'),
        description: _(
            'Durant de nombreuses années, j’ai occupé des fonctions commerciales et de management au contact d’entreprises de toutes tailles, dans les secteurs logistique, industriel et de la distribution. J’ai toujours eu à cœur de comprendre les enjeux de mes clients afin de répondre aux mieux à leurs attentes.En tant que manager, je mets un point d’honneur à accompagner, à encourager et à encadrer mes équipes pour qu’elles puissent mener sereinement les missions confiées. Rejoindre Work&You a été pour moi une évidence car je me sens particulièrement proche de ses valeurs. En effet, nous proposons à nos clients et à nos candidats un accompagnement de qualité, en nous appuyant à la fois sur les compétences, la motivation et des valeurs humaines ainsi que sur des outils performants.'
        ),
        tags: [_('Engagée'), _('Bienveillante'), _('Challengeuse')],
    },
    {
        name: _('Emma DUFAUD'),
        image: Emma,
        job: _('Consultante en Recrutement -'),
        blueText: _('Toulouse'),
        description: _(
            "Après mes trois années d’études de commerce, durant lesquelles j’ai pu travailler à l’étranger mais aussi dans l’immobilier, j’ai su développer mon sens du relationnel et mon envie d’aider et d’accompagner les clients. C’est pour cela que j’ai décidé de rejoindre Work And You, un cabinet avec des valeurs qui sont en adéquation avec les miennes.En effet, j’accorde une grande importance à l’humain ainsi qu'à la relation client."
        ),
    },
    {
        name: _('Alban MURUGNEUX'),
        image: Alban,
        job: _("Directeur d'Agence -"),
        blueText: _('Lyon'),
        description: _(
            'Mon parcours professionnel a débuté avec la mécanique en compétition automobile, sur les routes du championnat du monde de Rallye. De cette première expérience, j’ai gardé le goût de la précision, de l’efficacité, de l’exigence et d’esprit d’équipe. Ce sont ces valeurs qui ont guidés mes choix professionnels et ont façonné mon parcours. Dans mon cœur de métier, l’automobile, j’ai occupé des fonctions techniques, de management et de direction. J’ai aussi emprunté des chemins de traverse, par goût du challenge et du défi, en devenant gérant d’un centre de profit dans la restauration, durant plusieurs années.Ce sont ces expériences et ces qualités complémentaires que je mets aujourd’hui au service de Work&You avec l’ambition et l’objectif de répondre au mieux aux exigences du client afin de trouver le candidat idéal.'
        ),
    },
    {
        name: _('Marion DELSUC'),
        image: Marion,
        job: _('Consultante en recrutement -'),
        blueText: _('Agen'),
        description: `Après des études d'ingénieur en Agronomie/Agroalimentaire et 12 années passées à travailler en milieu industriel, sur divers postes opérationnels, j'ai découvert le monde du recrutement et cela a été pour moi une révélation. J'ai eu un véritable coup de coeur pour le Cabinet Work&You dont je partage les valeurs de service clients et d'exigence, et j'ai souhaité les rejoindre pour accompagner entreprises et candidats afin de" provoquer LA rencontre professionnelle " !`,
    },
    {
        name: _('Charlotte LELAURE'),
        image: Charlotte,
        job: _('Consultante en recrutement -'),
        blueText: _('Nantes'),
        description: _(
            'Mon parcours professionnel a débuté avec la mécanique en compétition automobile, sur les routes du championnat du monde de Rallye. De cette première expérience, j’ai gardé le goût de la précision, de l’efficacité, de l’exigence et d’esprit d’équipe. Ce sont ces valeurs qui ont guidés mes choix professionnels et ont façonné mon parcours. Dans mon cœur de métier, l’automobile, j’ai occupé des fonctions techniques, de management et de direction. J’ai aussi emprunté des chemins de traverse, par goût du challenge et du défi, en devenant gérant d’un centre de profit dans la restauration, durant plusieurs années.Ce sont ces expériences et ces qualités complémentaires que je mets aujourd’hui au service de Work&You avec l’ambition et l’objectif de répondre au mieux aux exigences du client afin de trouver le candidat idéal.'
        ),
    },
]

export default TeamsPresentationData
