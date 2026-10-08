import axios from 'axios'
const backendUrl=import.meta.env.VITE_BACKEND_URL??'http://localhost:8000'
export const api=axios.create({baseURL:`${backendUrl}/api`,withCredentials:true,withXSRFToken:true,headers:{Accept:'application/json','Content-Type':'application/json'}})
export const sanctum=axios.create({baseURL:backendUrl,withCredentials:true,withXSRFToken:true,headers:{Accept:'application/json'}})
export type MutlogUser={id:number;name:string;phone:string;address:string;city:string;user_type:'client'|'transporteur'|'admin';email?:string|null}
export async function initializeCsrf(){await sanctum.get('/sanctum/csrf-cookie')}
export type TransportRequestStatus='demande'|'recherche'|'mutualisation'|'confirmee'|'en_cours'|'livree'|'terminee'
export type TransportRequest={id:number;user_id:number;departure:string;destination:string;desired_date:string;cargo_type:string;weight_kg:number;volume_m3:number|null;package_count:number|null;special_instructions:string|null;contact_phone:string;status:TransportRequestStatus;created_at:string;updated_at:string}
export type Vehicle={id:number;user_id:number;vehicle_type:string;brand:string;registration:string;capacity_tonnes:number;available_volume_m3:number|null;accepted_cargo_type:string;is_available:boolean}
export type TransportOffer={id:number;user_id:number;vehicle_id:number;departure:string;destination:string;offer_date:string;capacity_tonnes:number;available_capacity_tonnes:number;accepted_cargo_type:string;pricing_mode:'forfait'|'tonne';price_amount:number|null;additional_information:string|null;status:'active'|'inactive';vehicle?:Vehicle}
export async function fetchCurrentUser(){const{data}=await api.get<{user:MutlogUser}>('/auth/me');return data.user}
export async function fetchClientRequests(){const{data}=await api.get<{data:TransportRequest[]}>('/client/requests');return data.data}
export async function fetchClientRequest(id:string|number){const{data}=await api.get<{data:TransportRequest}>('/client/requests/'+id);return data.data}
export async function createTransportRequest(payload:{departure:string;destination:string;desired_date:string;cargo_type:string;weight_kg:number;volume_m3?:number|null;package_count?:number|null;special_instructions?:string|null;contact_phone:string}){const{data}=await api.post<{data:TransportRequest}>('/client/requests',payload);return data.data}
export async function fetchTransportMatches(id:string|number){const{data}=await api.get<{data:TransportOffer[];criteria:Record<string,unknown>}>(`/client/requests/${id}/matches`);return data}
export async function fetchTransporterVehicles(){const{data}=await api.get<{data:Vehicle[]}>('/transporter/vehicles');return data.data}
export async function createVehicle(payload:{vehicle_type:string;brand:string;registration:string;capacity_tonnes:number;available_volume_m3?:number|null;accepted_cargo_type:string}){const{data}=await api.post<{data:Vehicle}>('/transporter/vehicles',payload);return data.data}
export async function fetchTransporterOffers(){const{data}=await api.get<{data:TransportOffer[]}>('/transporter/offers');return data.data}
export async function createTransporterOffer(payload:{vehicle_id:number;departure:string;destination:string;offer_date:string;capacity_tonnes:number;available_capacity_tonnes:number;accepted_cargo_type:string;pricing_mode:'forfait'|'tonne';price_amount:number;additional_information?:string|null}){const{data}=await api.post<{data:TransportOffer}>('/transporter/offers',payload);return data.data}
