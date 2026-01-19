import dns from 'dns';

export default function setupDNS() {
  if(process.env.NODE_ENV !== 'production') {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  }
}