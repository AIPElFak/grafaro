import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {UserService, Profile} from '../login-page/user.service';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class Auth0Service {

    public user$: ReplaySubject<Profile> = new ReplaySubject(1);

    // Configure Auth0
    // todo type?
    auth0 = new (<any>auth0).WebAuth({
        domain: 'pritilender.eu.auth0.com',
        clientID: 'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
        redirectUri: 'http://localhost:4200',
        responseType: 'token id_token',
        scope: 'profile'
    });

    constructor(private userService: UserService,
                private router: Router) {
        this.handleAuthentication();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err: string, authResult: any) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setUser(authResult);
                this.router.navigate(['/']);
            } else if (authResult && authResult.error) {
                alert('Error: ' + authResult.error);
            } else if (this.isAuthenticated()) {
                this.getAuthenticatedUser();
            }
        });
    }

    public socialLogin(connection: string): void {
        this.auth0.authorize({
            connection
        });
    }

    public isAuthenticated(): boolean {
        // Check whether the id_token is expired or not
        return tokenNotExpired();
    }

    public logout(): void {
        this.user$.next({
            _id: '',
            socialId: '',
            displayName: '',
        });
        localStorage.removeItem('socialId');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        this.router.navigate(['/login']);
    }

    private setUser(authResult: any): void {
        const socialId: string = authResult.idTokenPayload.user_id;

        this.userService.getUserBySocialId(socialId)
            .take(1)
            .subscribe(dbUser => {
                this.user$.next(dbUser);
            });

        localStorage.setItem('socialId', socialId);
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
    }

    private getAuthenticatedUser(): void {
        const socialId = localStorage.getItem('socialId');

        this.userService.getUserBySocialId(socialId)
            .take(1)
            .subscribe(dbUser => {
                this.user$.next(dbUser);
            });
    }

    public changeDisplayName(newName: string): void {
        this.userService.changeDisplayName(newName)
            .subscribe(user => {
                this.user$.next(user);
            });
    }
}
