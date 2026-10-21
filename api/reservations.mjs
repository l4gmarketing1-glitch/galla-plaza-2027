import { reservationEndpoint, supabaseStore } from '../server/reservation-handler.mjs';
export default async function handler(req,res){return reservationEndpoint(req,res,supabaseStore());}
