/*export const authConfig = {
    providers:[],
    pages:{
        signIn:'/login',
    },
    callbacks:{
        authorized({auth,request}){
            const isLoggedIn = auth?.user
            const isOnContas = request.nextUrl.pathname.startsWith('/contas')
            const isOnCadastro = request.nextUrl.pathname.startsWith('/cadastro')
            if (isOnContas) {
                if (isLoggedIn) return true;
                return false;
            }else if (isLoggedIn) {
                return Response.redirect(new URL('/contas', request.nextUrl));
            }
            return true;
        }
    }
}*/