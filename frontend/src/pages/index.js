// ------------------------------- Pages ------------------------------- #
export { default as Home } from './home/Home';
export { default as NotFound } from './notFound/NotFound';

// ------------------------------- Auth Pages ------------------------------- #
export { default as VetRegistration } from './register/VetRegistration';
export { default as VetClinicRegistration } from './register/VetClinicRegistration';
export { default as WelfareOrgRegistration } from './register/WelfareOrgRegistration';
export { default as PetOwnerRegistration } from './register/PetOwnerRegistration';

export {default as PetOwnerLogin} from './login/PetOwnerLogin';
export {default as VetClinicLogin} from './login/VetClinicLogin';
export {default as WelfareOrgLogin} from './login/WelfareOrgLogin';



// ------------------------------- Pet Pages ------------------------------- #
export { default as PetSearch } from './petpages/PetSearch';
export { default as RegisterPet } from './petpages/RegisterPet';
export { default as TransferPetOwnership } from './petpages/TransferPetOwnership';

// ------------------------------- Dashboards ------------------------------- #
export { default as PetOwnerDashboard } from './dashboards/PetOwnerDashboard';