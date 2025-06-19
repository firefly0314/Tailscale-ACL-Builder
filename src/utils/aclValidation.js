const validateACLSyntax = (parsedAcl) => {
  const errors = [];

  // Validate legacy ACLs
  if (parsedAcl.acls) {
    parsedAcl.acls.forEach((rule, index) => {
      if (!rule.src.every(src =>
        src.match(/^([a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+|group:[a-zA-Z0-9_-]+)$/)
      )) {
        errors.push(`Invalid source format in rule ${index}`);
      }

      if (!['accept', 'deny'].includes(rule.action)) {
        errors.push(`Invalid action in rule ${index}: must be 'accept' or 'deny'`);
      }

      if (rule.dst) {
        rule.dst.forEach(dst => {
          if (!dst.match(/^[0-9.:/*]+$/)) {
            errors.push(`Invalid destination format in rule ${index}`);
          }
        });
      }
    });
  }

  // Validate grants
  if (parsedAcl.grants) {
    parsedAcl.grants.forEach((grant, index) => {
      if (!Array.isArray(grant.src) || grant.src.length === 0) {
        errors.push(`Grant ${index} missing src`);
      } else if (!grant.src.every(s => s.match(/^([a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+|group:[a-zA-Z0-9_-]+|tag:[a-zA-Z0-9_-]+|autogroup:[a-zA-Z0-9_-]+)$/))) {
        errors.push(`Invalid src format in grant ${index}`);
      }

      if (!Array.isArray(grant.dst) || grant.dst.length === 0) {
        errors.push(`Grant ${index} missing dst`);
      } else if (!grant.dst.every(d => d.match(/^([a-zA-Z0-9_.:-]+|tag:[a-zA-Z0-9_-]+|autogroup:[a-zA-Z0-9_-]+)$/))) {
        errors.push(`Invalid dst format in grant ${index}`);
      }

      if (grant.ip && (!Array.isArray(grant.ip) || !grant.ip.every(p => p.match(/^(tcp|udp|icmp|icmpv6|any)(:[0-9*,-]+)?$/i)))) {
        errors.push(`Invalid ip format in grant ${index}`);
      }

      if (grant.app && typeof grant.app !== 'object') {
        errors.push(`Invalid app format in grant ${index}`);
      }
    });
  }

  return errors;
};

export { validateACLSyntax };
