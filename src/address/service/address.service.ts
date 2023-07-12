import { PrismaService } from "src/database/prisma.service";
import { Injectable } from '@nestjs/common';
import { Address } from "@prisma/client";
import { CreateAddressBody } from "../middleware/address";
import { randomUUID } from "crypto";
import { AddressDTO } from "../dtos/address";

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) { }

    async getAddress(id: string): Promise<AddressDTO> {
        const address: AddressDTO = await this.prisma.address.findUnique({
            select: {
                id: true,
                createdAt: true,
                description: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                                country: {
                                    select: {
                                        id: true,
                                        name: true,
                                        flag: true
                                    }
                                }
                            }
                        }
                    }
                },
                province: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true,
                                flag: true
                            }
                        }
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true,
                        flag: true
                    }
                }
            },
            where: {
                id: id
            }
        })

        return address;
    }

    async createAddress(address: CreateAddressBody): Promise<AddressDTO> {
        const createdAddress: AddressDTO = await this.prisma.address.create({
            data: {
                id: randomUUID(),
                description: address.description,
                cityId: address.cityId,
                provinceId: address.provinceId,
                countryId: address.countryId
            },
            select: {
                id: true,
                createdAt: true,
                description: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                                country: {
                                    select: {
                                        id: true,
                                        name: true,
                                        flag: true
                                    }
                                }
                            }
                        }
                    }
                },
                province: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true,
                                flag: true
                            }
                        }
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true,
                        flag: true
                    }
                }
            }
        })

        return createdAddress;
    }

    async updateAddress(id: string, address: CreateAddressBody): Promise<AddressDTO> {
        const updatedAddress: AddressDTO = await this.prisma.address.update({
            data: {
                id: randomUUID(),
                description: address.description,
                cityId: address.cityId,
                provinceId: address.provinceId,
                countryId: address.countryId
            },
            where: {
                id: id
            },
            select: {
                id: true,
                createdAt: true,
                description: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                                country: {
                                    select: {
                                        id: true,
                                        name: true,
                                        flag: true
                                    }
                                }
                            }
                        }
                    }
                },
                province: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true,
                                flag: true
                            }
                        }
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true,
                        flag: true
                    }
                }
            }
        })

        return updatedAddress;
    }
}