import { PrismaService } from "src/database/prisma.service";
import { Injectable } from '@nestjs/common';
import { Address } from "@prisma/client";
import { CreateAddressBody } from "./middleware/address.body";
import { randomUUID } from "crypto";
import { AddressDTO, CityDTO, CountryDTO, ProvinceDTO } from "./dtos/address.dto";

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

    async getCities(name: string, provName: string): Promise<CityDTO[]> {
        const cityList = await this.prisma.city.findMany({
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
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: name,
                            mode: 'insensitive'
                        },
                    },
                    {
                        province: {
                            OR: [
                                {
                                    name: {
                                        contains: provName,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    id: {
                                        equals: provName,
                                    }
                                }
                            ]

                        }
                    }
                ]
            }
        })

        return cityList;
    }

    async getProvincies(name: string, countryName: string): Promise<ProvinceDTO[]> {
        const provinceList = await this.prisma.province.findMany({
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
            },
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                },
                country: {
                    OR: [
                        {
                            name: {
                                contains: countryName,
                                mode: 'insensitive'
                            }
                        },
                        {
                            id: {
                                equals: countryName
                            }
                        }
                    ]
                }
            }
        })

        return provinceList;
    }

    async getCountries(name: string): Promise<CountryDTO[]> {
        const cityList = await this.prisma.country.findMany({
            select: {
                id: true,
                name: true,
                flag: true
            },
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                },

            }
        })

        return cityList;
    }
}