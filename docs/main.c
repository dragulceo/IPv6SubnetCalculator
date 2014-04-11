/*
ionuts [at] craiova [dot] rcs-rds [dot]ro
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>

#define s6_addr32   __u6_addr.__u6_addr32
#define s6_addr16   __u6_addr.__u6_addr16

int parse_v6addr(char *buf, struct in6_addr *prefix, int *mask)
{
	char *s_mask;
	
	if (strlen(buf) > INET6_ADDRSTRLEN + 4 || strlen(buf) < 4) {
		printf("prefix too long!\n");
		return 1;
	}
	if ((s_mask = index(buf, '/')) == NULL) {
		printf("missing '/' character\n");
		return 2;
	}
	
	*s_mask ='\0';
	s_mask++;
	
	*mask = atoi(s_mask);
	if (*mask < 1 || *mask > 64) {
		printf("mask1 < 1 OR mask1 > 64\n");
		return 3;
	}
	
	if (inet_pton(AF_INET6, buf, prefix) < 1) {
		printf("invalid ipv6 address\n");
		return 4;
	}
	prefix->s6_addr32[2] = 0;
	prefix->s6_addr32[3] = 0;
	return 0;
}

void usage()
{
	printf("rds_ipv6_pd <ipv6_prefix/mask1> [mask2] [index]\n");
}

int main(int argc, char *argv[])
{
	int mask, mask2;
	struct in6_addr prefix;
	uint64_t my_prefix, index, test;
	uint64_t my_mask = 0xffffffffffffffff;
	
	char ipv6_addr[INET6_ADDRSTRLEN];
	
	switch ( argc ) {
		case 2:			/* network range */
			if (parse_v6addr(argv[1], &prefix, &mask) != 0) {
				return 20;
			}
			my_mask <<= 64 - mask;
			my_prefix = 0x100000000ULL * htonl(prefix.s6_addr32[0]) + htonl(prefix.s6_addr32[1]);
			my_prefix &= my_mask;
			prefix.s6_addr32[0] = ntohl(my_prefix / 0x100000000);
			prefix.s6_addr32[1] = ntohl(my_prefix % 0x100000000);
			printf("Network range\n\t%04x:%04x:%04x:%04x:0000:0000:0000:0000\n",
                   htons(prefix.s6_addr16[0]), htons(prefix.s6_addr16[1]),
                   htons(prefix.s6_addr16[2]), htons(prefix.s6_addr16[3]));
			my_prefix += (1LLU << (64 - mask)) - 1;
			prefix.s6_addr32[0] = ntohl(my_prefix / 0x100000000);
			prefix.s6_addr32[1] = ntohl(my_prefix % 0x100000000);
			printf("\t%04x:%04x:%04x:%04x:ffff:ffff:ffff:ffff\n",
                   htons(prefix.s6_addr16[0]), htons(prefix.s6_addr16[1]),
                   htons(prefix.s6_addr16[2]), htons(prefix.s6_addr16[3]));
			break;
		case 3:			/* list of prefixes */
			if (parse_v6addr(argv[1], &prefix, &mask) != 0) {
				return 30;
			}
			
			mask2 = atoi(argv[2]);
			if (mask2 < mask || mask2 > 64) {
				printf("mask2 < mask1 OR mask2 > 64");
				return 31;
			}
			
			my_mask <<= 64 - mask;
			my_prefix = 0x100000000ULL * htonl(prefix.s6_addr32[0]) + htonl(prefix.s6_addr32[1]);
			my_prefix &= my_mask;
			
			for(index = 0; index < 1 << (mask2 - mask); index++) {
				prefix.s6_addr32[0] = ntohl(my_prefix / 0x100000000);
				prefix.s6_addr32[1] = ntohl(my_prefix % 0x100000000);
				printf("%s\n", inet_ntop(AF_INET6, &prefix, ipv6_addr, INET6_ADDRSTRLEN));
				my_prefix += 1LLU << (64 - mask2);
			}
			
			break;
		case 4:			/* prefix @ index */
            printf("%s %s %s\n", argv[1], argv[2], argv[3]);
			if (parse_v6addr(argv[1], &prefix, &mask) != 0) {
				return 40;
			}
			
			mask2 = atoi(argv[2]);
			if (mask2 < mask || mask2 > 64) {
				printf("mask2 < mask1 OR mask2 > 64");
		//		return 41;
			}
			
			index = strtoull(argv[3], NULL, 0);
//			if (index >= (1 << (mask2 - mask)) || index < 0) {
            if (index >= (1LLU << (mask2 - mask)) || index < 0) {
				printf("index too big ( >= 2^(mask2 - mask1) ) OR negative value\n");
				return 42;
			}
			
			my_mask <<= 64 - mask;
			
            printf("%llu %llu %llu %llu\n", prefix.s6_addr32[0], prefix.s6_addr32[1], htonl(prefix.s6_addr32[0]), htonl(prefix.s6_addr32[1]));
			my_prefix = 0x100000000ULL * htonl(prefix.s6_addr32[0]) + htonl(prefix.s6_addr32[1]);
            printf("%llu %llu %llu %llu\n", my_prefix >> 48, (my_prefix & 0x0000ffff00000000) >> 32, (my_prefix & 0x00000000ffff0000) >> 16, my_prefix & 0x000000000000ffff);
			my_prefix &= my_mask;
            printf("%llu %llu %llu %llu\n", my_prefix >> 48, (my_prefix & 0x0000ffff00000000) >> 32, (my_prefix & 0x00000000ffff0000) >> 16, my_prefix & 0x000000000000ffff);
            printf("index %llu %llu %llu %llu\n", index >> 48, (index & 0x0000ffff00000000) >> 32, (index & 0x00000000ffff0000) >> 16, index & 0x000000000000ffff);
			my_prefix += index * (1LLU << (64 - mask2));
            printf("%llu %llu %llu %llu\n", my_prefix >> 48, (my_prefix & 0x0000ffff00000000) >> 32, (my_prefix & 0x00000000ffff0000) >> 16, my_prefix & 0x000000000000ffff);
			prefix.s6_addr32[0] = ntohl(my_prefix / 0x100000000);
			prefix.s6_addr32[1] = ntohl(my_prefix % 0x100000000);
            
            printf("%llu %llu %llu %llu\n", prefix.s6_addr32[0], prefix.s6_addr32[1], htonl(prefix.s6_addr32[0]), htonl(prefix.s6_addr32[1]));
			printf("%s\n", inet_ntop(AF_INET6, &prefix, ipv6_addr, INET6_ADDRSTRLEN));
            
			break;
		default:
			usage();
	}
    
    
	return 0;
}
