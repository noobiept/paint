namespace Utilities
    {
    export function getRandomInt( min: number, max: number )
        {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        }


    export function getRandomFloat( min: number, max: number )
        {
        return Math.random() * (max - min) + min;
        }


    export function toCssColor( red: number, green: number, blue: number, alpha: number )
        {
        if ( typeof alpha == 'undefined' )
            {
            alpha = 1;
            }

        return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
        }


    /*
        Converts an object to string, and saves it in the local storage.
    */
    export function setObject( key: string, value: any )
        {
        localStorage.setItem( key, JSON.stringify( value ) );
        }


    /*
        Returns null if it doesn't find, otherwise returns the correspondent object that was saved in local storage.
    */
    export function getObject( key: string )
        {
        var value = localStorage.getItem( key );

        return value && JSON.parse( value );
        }
    }
