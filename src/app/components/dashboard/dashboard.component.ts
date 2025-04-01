import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeSection: string = 'profile';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const section = params['section'];
      if (section) this.activeSection = section;
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.router.navigate(['/dashboard'], { queryParams: { section } });
  }
}
