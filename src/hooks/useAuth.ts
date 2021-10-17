import { useStore } from 'src/store';
import { computed } from 'vue';
import { ApiResponse } from 'src/hooks/useHttp';
import { SourcePureErrors } from 'src/hooks/useErrors';
import { AuthData } from 'src/store/auth/state';
import { UserRole } from 'src/models/User';
import { arrayFrom } from 'src/utils/object';

export interface SignInPayload {
  login: string;
  password: string;
  rememberMe: boolean;
}

export interface SignInSuccessResponse {
  token: string;
  data: AuthData;
}
export type SignInFailureResponse = SourcePureErrors<keyof SignInPayload>

export type SignOutSuccessResponse = null;
export interface SignOutFailureResponse {
  [key: string]: string;
}

export const useAuth = <
  SignInResponse extends ApiResponse<SignInSuccessResponse, SignInFailureResponse>,
  SignOutResponse extends ApiResponse<SignOutSuccessResponse, SignOutFailureResponse>
>() => {
  const store = useStore();

  const isAuthorized = computed(() => store.getters['auth/isAuthorized'] as boolean);
  const userData = computed(() => store.getters['auth/data'] as AuthData);
  const isSigningIn = computed(() => store.getters['auth/isSigningIn'] as boolean);
  const isSigningOut = computed(() => store.getters['auth/isSigningOut'] as boolean);

  const signIn = async (payload: SignInPayload) => store.dispatch('auth/signIn', payload) as Promise<SignInResponse>;
  const signOut = async () => store.dispatch('auth/signOut') as Promise<SignOutResponse>;

  const can = computed(() => (role: UserRole | Array<UserRole>) => (
    (arrayFrom(role)).includes(userData.value?.role)
  ));

  return {
    isAuthorized,
    userData,
    signIn,
    signOut,
    isSigningIn,
    isSigningOut,
    can,
  };
};
