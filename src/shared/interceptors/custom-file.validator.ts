import { BadRequestException } from '@nestjs/common';


export class CustomFileValidator {
  // Este validador aceptará imágenes webp y controlará el tamaño
  validate(file: Express.Multer.File) {
    const allowedMimeTypes = ['image/webp', 'image/png', 'image/jpg', 'image/png']; // Puedes agregar más tipos si lo necesitas
    const maxSize = 900 * 1024; // 900KB

    // Validar tipo MIME
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('El archivo debe ser de tipo image/webp');
    }

    // Validar tamaño del archivo
    if (file.size > maxSize) {
      throw new BadRequestException(`El tamaño máximo permitido es ${maxSize / 1024} KB`);
    }

    return true;
  }
}
