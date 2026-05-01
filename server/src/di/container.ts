import { MongoUserRepository } from "../infrastructure/repositories/MongoUserRepository.js";
import { MongoPdfRepository } from "../infrastructure/repositories/MongoPdfRepository.js";
import { S3StorageRepository } from "../infrastructure/repositories/S3StorageRpository.js";
import { AuthService } from "../core/services/AuthService.js";
import { PdfService } from "../core/services/PdfService.js";
import { AuthController } from "../web/controllers/AuthController.js";
import { PdfController } from "../web/controllers/PdfController.js";

class Container {
  private static _instance: Container;

  // Repositories
  private _userRepository: MongoUserRepository;
  private _pdfRepository: MongoPdfRepository;
  private _fileStorage: S3StorageRepository;

  // Services
  private _authService: AuthService;
  private _pdfService: PdfService;

  // Controllers
  private _authController: AuthController;
  private _pdfController: PdfController;

  private constructor() {
    // Instantiate Repositories
    this._userRepository = new MongoUserRepository();
    this._pdfRepository = new MongoPdfRepository();
    this._fileStorage = new S3StorageRepository();

    // Instantiate Services
    this._authService = new AuthService(this._userRepository);
    this._pdfService = new PdfService(this._pdfRepository, this._fileStorage);

    // Instantiate Controllers
    this._authController = new AuthController(this._authService);
    this._pdfController = new PdfController(this._pdfService);
  }

  public static get instance(): Container {
    if (!Container._instance) {
      Container._instance = new Container();
    }
    return Container._instance;
  }

  public get authController(): AuthController {
    return this._authController;
  }

  public get pdfController(): PdfController {
    return this._pdfController;
  }
}

export const container = Container.instance;
