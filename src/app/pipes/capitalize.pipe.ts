import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {

  /**
   * capitalize and remove special chars pipe
   * @param value string to capitalize and clean special chars from
   */
  transform(value: string): string {
    if (value) {

      const words: string[] = value.replace(/[^A-Za-z() 0-9,.]/g, '').split(' ');
      let upperCasedTitle = '';

      words.forEach((word, index) => {
        let noSpaceLastConcat = ' ';

        // if reached last word dont add space
        if (words.length === index + 1) {
          noSpaceLastConcat = '';
        }

        upperCasedTitle = upperCasedTitle.concat(word.charAt(0).toUpperCase() + word.slice(1) + noSpaceLastConcat);
      });

      return upperCasedTitle;
    }
    return value;
  }

}
