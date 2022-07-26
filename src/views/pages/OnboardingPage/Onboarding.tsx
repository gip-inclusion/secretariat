import React from 'react';
import type { Request } from 'express'

import { hydrateOnClient } from '../../hydrateOnClient'
import { PageLayout } from '../components/PageLayout';
import CitySelect from '../components/CitySelect';
import { Member } from '../../../models/member'
import { StartupInfo } from '../../../models/startup'
import ReferentSelect from '../components/ReferentSelect';
import SESelect from '../components/SESelect';
import DatepickerSelect from '../components/DatepickerSelect';

function formatDateToReadableFormat(date) {
    let day = date.getDate().toString();
    day = day.length === 1 ? `0${day}` : day;
    let month = (date.getMonth() + 1).toString();
    month = month.length === 1 ? `0${month}` : month;
    return `${date.getFullYear()}-${month}-${day}`;
  }

interface CommuneInfo {
    nom: string,
    codesPostaux?: string[]
}

interface Option {
  key: string,
  name: string
}

interface FormData {
    gender: string,
    legal_status: string,
    workplace_insee_code: string,
    tjm: number,
    secondary_email: string,
    osm_city: string,
    start?: string,
    end?: string
}

interface Props {
    title?: string,
    errors?: string[],
    messages?: string[],
    request: Request,
    formData: FormData,
    users: Member[],
    domaineOptions?: Option[],
    statusOptions?: Option[],
    genderOptions?: Option[],
    formValidationErrors?: any,
    communeInfo?: CommuneInfo,
    startups?: StartupInfo[],
    startupOptions?: {
        value: string,
        label: string
    }[],
    userConfig: {
        statusOptions: Option[],
        minStartDate: string,
        badgeOptions: Option[],
    }
}

/* Pure component */
export const Onboarding = PageLayout(function (props: Props) {
    const [state, setState] = React.useState<any>({
        selectedName: '',
        ...props,
        formData: {
            ...props.formData,
            start: props.formData.start ? new Date(props.formData.start) : '',
            end: props.formData.end ? new Date(props.formData.end) : '',
        }
    });
    const css = ".panel { overflow: scroll; }"

    const changeFormData = (key, value) => {
        const formData = state.formData
        formData[key] = value
        setState({
            ...state,
            formData
        })
    }

    const handleGenderChange = (e) => {
        changeFormData('gender', e.currentTarget.value)
    }

    const handleDomaineChange = (e) => {
        changeFormData('domaine', e.currentTarget.value)
    }

    const handleLegalStatusChange = (e) => {
        changeFormData('legal_status', e.currentTarget.value)
    }

    const handleStatusChange = (e) => {
        changeFormData('status', e.currentTarget.value)
    }

    const handleTJMChange = (e) => {
        changeFormData('tjm', e.currentTarget.value)
    }

    const handleEmail = (e) => {
        changeFormData('email', e.currentTarget.value)
    }

    const handleCitySelect = (newValue) => {
        if (newValue.isOSM) {
            changeFormData('osm_city', JSON.stringify(newValue))
            changeFormData('workplace_insee_code', '')
        } else {
            changeFormData('workplace_insee_code', newValue.value)
            changeFormData('osm_city', '')
        }
    }

    const getDefaultValue = () => {
        if (props.formData.workplace_insee_code) {
            return props.communeInfo ? `${props.communeInfo.nom}  (${props.communeInfo.codesPostaux[0]})`: null
        } else if (state.formData.osm_city) {
            return JSON.parse(state.formData.osm_city).label
        } 
        return ''
    }

    const formatDate = (date: Date) => {
        return formatDateToReadableFormat(date)
    }

    return (
        <>
        <div className="container container-small">
        { !!props.errors.length && <div className="notification error">
            { props.errors.map(function(error, i) {
                return <li key={i}><strong>Erreur : </strong>{error}</li>
            })}
        </div>}
        { !!props.messages.length && <div className="notification">
            {props.messages}
        </div>}
            <div className="panel margin-top-m">
            <h3>Créer ma fiche Github</h3>
            <div className="beta-banner"></div>
            <form action="/onboarding" method="POST">
                <h4>Tes infos persos</h4>
                <div className="form__group">
                    <p>
                        Tes informations personnelles seront affichées sur la page <a href="https://beta.gouv.fr/communaute/" target="_blank">Communauté</a> du site BetaGouv, ainsi que dans la fiche de ta startup.
                    </p>
                    <label htmlFor="firstName">
                        <strong>Prénom (obligatoire)</strong>
                    </label>
                    <input name="firstName" 
                        defaultValue={state.formData.firstName}
                        onChange={(e) => { changeFormData('firstName', e.currentTarget.value)}}
                        required/>
                    <label htmlFor="lastName">
                        <strong>Nom de famille (obligatoire)</strong>
                    </label>
                    <input name="lastName" 
                        defaultValue={state.formData.lastName}
                        onChange={(e) => { changeFormData('lastName', e.currentTarget.value)}}
                        required/>
                </div>
                <div className="form__group">
                    <label htmlFor="description">
                        <strong>Courte bio</strong><br />
                        Cette phrase d'accroche sera affichée sur <a href="https://beta.gouv.fr/communaute/annuaire">l'annuaire</a>.<br />
                        <i>Exemple : « Développeur le jour, musicien la nuit. »</i>
                        <textarea rows={2} name="description" defaultValue={state.formData.description}></textarea>
                    </label>
                </div>
                <div className="form__group">
                    <label htmlFor="website">
                        <strong>Site personnel</strong><br />
                        Commençant avec <em>http://</em> ou <em>https://</em>
                    </label>
                    <input
                        name="website"
                        defaultValue={state.formData.website}
                        onChange={(e) => { changeFormData('website', e.currentTarget.value)}}
                        pattern="^(http|https)://.+" title="Doit commencer par http:// ou https://"/>
                </div>
                <div className="form__group">
                    <label htmlFor="github">
                        <strong>Nom d'utilisateur Github si tu as un compte (sans @)</strong>
                    </label>
                    <p>Si tu ne sais pas ce qu'est Github, laisse ce champ vide.</p>
                    <input name="github" pattern="^[A-z\d](?:[A-z\d]|-(?=[A-z\d])){0,38}$"
                        value={state.formData.github}
                        onChange={(e) => { changeFormData('github', e.currentTarget.value)}}
                        title="Nom d'utilisateur Github si tu as un compte (sans @)"/>
                </div>
                <div className="form__group">
                    <label htmlFor="gender">
                        <strong>Genre</strong><br />
                        Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                    </label>
                    <select
                        name="gender"
                        value={state.formData.gender}
                        onChange={handleGenderChange}
                        placeholder="Sélectionne une valeur" required>
                        <>
                        { props.genderOptions.map((gender) => { 
                            return <option
                                key={gender.key}
                                value={gender.key}
                                >{gender.name}</option>
                        })}
                        </>
                    </select>
                    { !!props.formValidationErrors['gender'] && 
                    <p className="text-small text-color-red">{props.formValidationErrors['gender']}</p>
                    }
                </div>
                <div className="form__group">
                    <label htmlFor="workplace_insee_code">
                        <strong>Lieu de travail principal</strong><br />
                        Cette information est utilisée pour faire une carte des membres de la communauté 
                        <br></br>
                        <CitySelect
                            defaultValue={getDefaultValue()}
                            onChange={handleCitySelect}
                            placeholder={'Commune ou code postale'}
                        ></CitySelect>
                        <input
                            name="workplace_insee_code"
                            type="text"
                            id="input-insee-code"
                            readOnly={true}
                            value={state.formData.workplace_insee_code} hidden/>
                        { !!props.formValidationErrors['workplace_insee_code'] && 
                            <p className="text-small text-color-red">{props.formValidationErrors['workplace_insee_code']}</p>
                        }
                        <input
                            name="osm_city"
                            type="text"
                            id="input-osm-city"
                            readOnly={true}
                            value={state.formData.osm_city} hidden/>
                    </label>
                </div>
                <h4>Ta mission</h4>
                <div className="form__group">
                    <label htmlFor="domaine">
                        <strong>Domaine (obligatoire)</strong><br />
                        Quel est le domaine de ta mission ?
                    </label>
                    <select
                        name="domaine"
                        value={state.formData.domaine}
                        onChange={handleDomaineChange}
                        placeholder="Sélectionne une valeur" required>
                        <>
                        { props.domaineOptions.map((domaine) => { 
                            return <option
                                key={domaine.key}
                                value={domaine.name}
                                >{domaine.name}</option>
                        })}
                        </>
                    </select>
                </div>
                <div className="form__group">
                    <label htmlFor="role">
                        <strong>Rôle chez BetaGouv (obligatoire)</strong><br />
                        Quel est ton titre de poste ? Développeuse, Intrapreneur, Chargée de déploiement, Coach, UX Designer...
                    </label>
                    <input name="role"
                        onChange={(e) => { changeFormData('role', e.currentTarget.value)}}
                        value={state.formData.role}
                        required/>
                </div>
                <div className="form__group">
                    <label htmlFor="start">
                        <strong>Début de la mission (obligatoire)</strong><br />
                        <i>Au format JJ/MM/YYYY</i>
                    </label>
                    <DatepickerSelect
                        name="startDate" min={props.userConfig.minStartDate} title="En format YYYY-MM-DD, par exemple : 2020-01-31" required
                        dateFormat='dd/MM/yyyy'
                        selected={state.formData.start} onChange={(date:Date) => changeFormData('start', date)} />
                    { !!props.formValidationErrors['début de la mission'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['début de la mission']}</p>
                    }
                    { !!props.formValidationErrors['date de début'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['date de début']}</p>
                    }
                    <input name="start"
                        value={state.formData.start ? formatDate(state.formData.start) : ''}
                        required hidden/>
                </div>
                <div className="form__group">
                    <label htmlFor="end">
                        <strong>Fin de la mission (obligatoire)</strong><br />
                        Si tu ne la connais pas, mets une date dans 3 mois, tu pourras la corriger plus tard.<br />
                        <i>Au format JJ/MM/YYYY</i>
                    </label>
                    <DatepickerSelect
                        name="endDate" min={props.userConfig.minStartDate} title="En format YYYY-MM-DD, par exemple : 2020-01-31" required
                        dateFormat='dd/MM/yyyy'
                        selected={state.formData.end} onChange={(date:Date) => changeFormData('end', date)} />
                    { !!props.formValidationErrors['fin de la mission'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['fin de la mission']}</p>
                    }
                    { !!props.formValidationErrors['date de fin'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['date de fin']}</p>
                    }
                    <input name="end"
                        value={state.formData.end ? formatDate(state.formData.end) : ''}
                        required hidden/>
                </div>
                <div className="form__group">
                    <label htmlFor="status">
                        <strong>Statut (obligatoire)</strong><br />
                    </label>
                    { props.userConfig.statusOptions.map((status) => {
                        
                        return (<span key={status.key}><input type="radio" name="status"
                            value={status.key}
                            onChange={handleStatusChange}
                            checked={status.key === state.formData.status}
                            required/>{status.name}<br/></span>)

                    })}
                    { !!props.formValidationErrors['status'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['status']}</p>
                    }
                </div>
                <div className="form__group">
                    <label htmlFor="legal_status">
                        <strong>Statut legal de ton entreprise (obligatoire)</strong><br />
                    </label>
                    { props.statusOptions.map((legal_status) => {
                        
                        return (<span key={legal_status.key}><input type="radio" name="legal_status"
                            value={legal_status.key}
                            onChange={handleLegalStatusChange}
                            checked={legal_status.key === state.formData.legal_status}
                            required/>{legal_status.name}<br/></span>)

                    })}
                    { !!props.formValidationErrors['legal_status'] && 
                        <p className="text-small text-color-red">{props.formValidationErrors['legal_status']}</p>
                    }
                </div>
                <div className="form__group">
                    <label htmlFor="tjm">
                        <strong>TJM moyen HT (si tu es indépendant)</strong><br />
                        Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                        <input
                            onChange={handleTJMChange}
                            defaultValue={state.formData.tjm || 0}
                            id="tjm" name="tjm" type="number" placeholder="TJM moyen ht en euros"/>
                    </label>
                </div>
                <div className="form__group">
                    <label htmlFor="referentList">
                        <b>Référent (obligatoire)</b><br />
                        Selectionne un membre l'équipe de co-animation avec qui tu es en contact.
                    </label>
                    <label htmlFor="username_select"></label>
                    <ReferentSelect
                        onChange={(e) => changeFormData('referent', e.value)}
                        referents={props.users.map(u => ({
                            value: u.id,
                            label: u.fullname
                        }))}
                        defaultValue={props.users.map(u => ({
                            value: u.id,
                            label: u.fullname
                        })).find(d => d.value === state.formData.referent)}></ReferentSelect>
                    <input type="hidden" name="referent" value={state.formData.referent} required/>
                </div>
                <div className="form__group">
                    <label htmlFor="startup">
                        <strong>Startup d'État</strong><br />
                        Laisser vide si elle n'apparaît pas. Tu pourras modifier ton profil plus tard.
                    </label>
                    <SESelect
                        startups={props.startupOptions}
                        onChange={(e) => {
                            changeFormData('startup', e.value)
                        }}
                        isMulti={undefined}
                        placeholder={"Selectionne ta startup"}
                        defaultValue={props.startupOptions.find(d => d.value === state.formData.startup)}></SESelect>
                    <input type="hidden" name="startup" value={state.formData.startup} required/>
                </div>
                <div className="form__group">
                    <label htmlFor="employer">
                        <strong>Employeur</strong><br />
                        L'entité avec laquelle tu as signé ton contrat (DINUM, Octo...)
                    </label>
                    <input name="employer" value={state.formData.employer} onChange={(e) => changeFormData('employer', e.currentTarget.value)}/>
                </div>
                <div className="form__group">
                    <label htmlFor="badge">
                        <strong>Badge</strong><br />
                        Si tu souhaites accéder aux bureaux, il te faudra un badge. Il te faudra aussi en faire la demande séparément.
                        En cochant cette case, nous saurons que tu en fais la demande et le badge sera renouvellé automatiquement.
                    </label>
                    <select name="badge">
                        <option value=""></option>
                        { props.userConfig.badgeOptions.map(function(badge) {
                            return <option value={badge.key} selected={badge.key === state.formData.key}>{badge.name}</option>
                        })}
                    </select>
                </div>
                <h4>Ton email</h4>
                <div className="form__group">
                    <label htmlFor="email">
                        <strong>Email pro/perso (obligatoire)</strong><br />
                        Ton email nous servira pour t'envoyer les informations relatives à ton compte
                    </label>
                        <input
                            onChange={handleEmail}
                            value={state.formData.email}
                            id="email" name="email" type="email" placeholder="un email de recupération" required/>
                    { !!props.formValidationErrors['email'] &&
                        <p className="text-small text-color-red">{props.formValidationErrors['mail']}</p>
                    }
                <label htmlFor="isEmailBetaAsked" className="padding-10-0">
                <input type="checkbox" name="isEmailBetaAsked"
                    onChange={(e) => changeFormData('isEmailBetaAsked', !state.formData.isEmailBetaAsked)}
                    value={state.formData.isEmailBetaAsked}
                    checked={!!state.formData.isEmailBetaAsked} />
                <strong className={!!props.formValidationErrors['email public'] ? 'text-color-red' : ''}>
                Je souhaite une adresse @beta.gouv.fr</strong>
                <br/>
                <span>
                    L'adresse @beta.gouv.fr donne accès aux outils officiels.
                    Elle est obligatoire si tu ne possédes pas déjà une adresse d'une structure publique (@pole-emploi.fr, @culture.gouv.fr...)
                </span>
                </label>
                { props.formValidationErrors['email public'] &&
                    <p className="text-small text-color-red">{ props.formValidationErrors['email public']}</p>
                } 
            </div>
            <button className="button" type="submit">Changer ces informations</button>
        </form>
    </div>
</div>
<style media="screen">
    {css}
</style>
</>
    )
})

hydrateOnClient(Onboarding)